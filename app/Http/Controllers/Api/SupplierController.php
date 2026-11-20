<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        return response()->json(Supplier::withCount('products')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string',
            'company'          => 'nullable|string',
            'phone'            => 'required|string',
            'whatsapp_number'  => 'nullable|string',
            'email'            => 'nullable|email',
            'address'          => 'nullable|string',
            'city'             => 'nullable|string',
            'notes'            => 'nullable|string',
            'status'           => 'boolean',
        ]);
        return response()->json(Supplier::create($validated), 201);
    }

    public function show(Supplier $supplier)
    {
        return response()->json($supplier->load(['products', 'stockLogs.product']));
    }

    public function update(Request $request, Supplier $supplier)
    {
        $supplier->update($request->all());
        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted']);
    }
}
