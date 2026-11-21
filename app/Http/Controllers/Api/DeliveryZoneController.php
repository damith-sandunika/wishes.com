<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeliveryZone;
use Illuminate\Http\Request;

class DeliveryZoneController extends Controller
{
    public function index()
    {
        return response()->json(DeliveryZone::orderBy('sort_order')->latest('id')->get());
    }

    public function publicIndex()
    {
        return response()->json(DeliveryZone::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'rate' => 'required|numeric|min:0',
            'estimated_time' => 'nullable|string|max:100',
            'districts' => 'nullable',
            'free_delivery_above' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->has('districts')) {
            $d = $request->districts;
            $validated['districts'] = is_string($d) ? json_decode($d, true) : (is_array($d) ? $d : []);
        }

        $zone = DeliveryZone::create($validated);
        return response()->json($zone, 201);
    }

    public function show(DeliveryZone $deliveryZone)
    {
        return response()->json($deliveryZone);
    }

    public function update(Request $request, DeliveryZone $deliveryZone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'rate' => 'required|numeric|min:0',
            'estimated_time' => 'nullable|string|max:100',
            'districts' => 'nullable',
            'free_delivery_above' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->has('districts')) {
            $d = $request->districts;
            $validated['districts'] = is_string($d) ? json_decode($d, true) : (is_array($d) ? $d : []);
        }

        $deliveryZone->update($validated);
        return response()->json($deliveryZone);
    }

    public function destroy(DeliveryZone $deliveryZone)
    {
        $deliveryZone->delete();
        return response()->json(['message' => 'Delivery zone removed successfully']);
    }
}
