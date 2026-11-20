<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockLog;
use App\Models\Product;
use Illuminate\Http\Request;

class StockLogController extends Controller
{
    public function index(Request $request)
    {
        $query = StockLog::with(['product', 'supplier'])->latest();
        if ($request->product_id) $query->where('product_id', $request->product_id);
        if ($request->type) $query->where('type', $request->type);
        return response()->json($query->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'supplier_id'  => 'nullable|exists:suppliers,id',
            'type'         => 'required|in:restock,sale,adjustment,return,expired',
            'quantity'     => 'required|integer',
            'unit_cost'    => 'nullable|numeric',
            'expiry_date'  => 'nullable|date',
            'batch_number' => 'nullable|string',
            'notes'        => 'nullable|string',
        ]);

        $log = StockLog::create($validated);

        // Update product stock
        $product = Product::find($validated['product_id']);
        if ($validated['type'] === 'restock' || $validated['type'] === 'return') {
            $product->increment('current_stock', abs($validated['quantity']));
        } elseif (in_array($validated['type'], ['sale', 'expired', 'adjustment'])) {
            $product->decrement('current_stock', abs($validated['quantity']));
        }

        // Save expiry date on product if restocking
        if ($validated['type'] === 'restock' && !empty($validated['expiry_date'])) {
            $product->update(['expiry_date' => $validated['expiry_date'], 'batch_number' => $validated['batch_number'] ?? null]);
        }

        return response()->json($log->load(['product', 'supplier']), 201);
    }

    public function expiringProducts()
    {
        $products = Product::whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->orderBy('expiry_date')
            ->get();
        return response()->json($products);
    }
}
