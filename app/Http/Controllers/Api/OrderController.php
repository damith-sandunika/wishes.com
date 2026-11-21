<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Orders\CreateOrderAction;
use App\Actions\Orders\UpdateOrderStatusAction;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(100, max(10, (int)$request->get('per_page', 25)));
        
        $query = Order::with(['items', 'statusHistories'])->latest();

        if ($request->filled('status')) {
            $query->where('delivery_status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('invoice_number', 'like', "%{$s}%")
                  ->orWhere('tracking_number', 'like', "%{$s}%")
                  ->orWhere('customer_name', 'like', "%{$s}%")
                  ->orWhere('whatsapp_number', 'like', "%{$s}%");
            });
        }

        if ($request->boolean('all')) {
            return response()->json($query->get());
        }

        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request, CreateOrderAction $createOrderAction)
    {
        if (is_string($request->items)) {
            $request->merge(['items' => json_decode($request->items, true)]);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:150',
            'whatsapp_number' => 'required|string|max:20',
            'sender_email' => 'nullable|email|max:150',
            'create_account' => 'nullable|boolean',
            'password' => 'nullable|string|min:6',
            'recipient_name' => 'nullable|string|max:150',
            'recipient_phone' => 'nullable|string|max:20',
            'delivery_address' => 'required|string|max:500',
            'delivery_date' => 'nullable|date',
            'delivery_time_slot' => 'nullable|string|max:50',
            'delivery_time' => 'nullable|string|max:50',
            'province' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'latitude' => 'nullable|string|max:50',
            'longitude' => 'nullable|string|max:50',
            'payment_method' => 'required|string|max:50',
            'payment_slip' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'delivery_method' => 'nullable|string|max:50',
            'delivery_charge' => 'nullable|numeric',
            'coupon_code' => 'nullable|string|max:50',
            'order_notes' => 'nullable|string|max:1000',
            'gift_message' => 'nullable|string|max:1000',
            'gift_wrapping' => 'nullable|boolean',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $slipPath = null;
        if ($request->hasFile('payment_slip')) {
            // Secure slip storage in private/protected disk if possible, else standard public
            $slipPath = $request->file('payment_slip')->store('slips', 'public');
        }

        $order = $createOrderAction->execute($validated, $slipPath);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['items', 'statusHistories', 'user']));
    }

    public function update(Request $request, Order $order, UpdateOrderStatusAction $updateOrderStatusAction)
    {
        $validated = $request->validate([
            'payment_status' => 'nullable|string|max:50',
            'delivery_status' => 'nullable|string|max:50',
            'additional_charge' => 'nullable|numeric|min:0',
            'additional_charge_note' => 'nullable|string|max:255',
            'delivery_charge' => 'nullable|numeric|min:0',
            'order_notes' => 'nullable|string|max:1000',
        ]);

        if (array_key_exists('additional_charge', $validated) || array_key_exists('delivery_charge', $validated)) {
            $deliv = isset($validated['delivery_charge']) ? (float)$validated['delivery_charge'] : (float)$order->delivery_charge;
            $add = isset($validated['additional_charge']) ? (float)$validated['additional_charge'] : (float)($order->additional_charge ?? 0);
            $sub = (float)$order->sub_total;
            $disc = (float)$order->discount_amount;
            $validated['grand_total'] = max(0, $sub + $deliv + $add - $disc);
        }

        $order = $updateOrderStatusAction->execute($order, $validated, $request->user());

        return response()->json($order->load(['items', 'statusHistories', 'user']));
    }

    public function downloadSlip(Order $order)
    {
        if (!$order->payment_slip) {
            return response()->json(['message' => 'No payment slip attached.'], 404);
        }

        $disk = Storage::disk('public')->exists($order->payment_slip) ? 'public' : 'private';
        if (!Storage::disk($disk)->exists($order->payment_slip)) {
            return response()->json(['message' => 'Slip file not found.'], 404);
        }

        return Storage::disk($disk)->response($order->payment_slip);
    }
}
