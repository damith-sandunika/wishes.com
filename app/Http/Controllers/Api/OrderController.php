<?php

namespace App\Http\Controllers\Api;

use App\Actions\Orders\CreateOrderAction;
use App\Http\Controllers\Controller;
use App\Jobs\SendWhatsAppOrderNotification;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(100, max(10, (int)$request->get('per_page', 25)));
        
        if ($request->boolean('all')) {
            return response()->json(Order::with('items')->latest()->get());
        }

        return response()->json(Order::with('items')->latest()->paginate($perPage));
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
            $slipPath = $request->file('payment_slip')->store('slips', 'public');
        }

        $order = $createOrderAction->execute($validated, $slipPath);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items'));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => 'nullable|string',
            'delivery_status' => 'nullable|string',
        ]);

        $order->update($validated);

        if ($request->filled('delivery_status')) {
            $status = $validated['delivery_status'];
            $templateKey = match ($status) {
                'Confirmed' => 'wa_confirm_template',
                'Delivered' => 'wa_delivery_template',
                'Completed' => 'wa_completed_template',
                'Cancelled' => 'wa_cancelled_template',
                default => null,
            };

            if ($templateKey) {
                SendWhatsAppOrderNotification::dispatch($order->id, $templateKey);
            }

            if (in_array($status, ['Delivered', 'Completed']) && $order->payment_slip) {
                Storage::disk('public')->delete($order->payment_slip);
                $order->update(['payment_slip' => null]);
            }
        }

        return response()->json($order);
    }
}
