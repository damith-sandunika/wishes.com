<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_percent' => 'required|numeric|min:1|max:100',
            'max_discount' => 'nullable|numeric',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean'
        ]);
        
        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function validateCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $coupon = Coupon::where('code', $request->code)->first();
        
        if (!$coupon) {
            return response()->json(['message' => 'Invalid coupon code.'], 404);
        }
        
        if (!$coupon->is_active) {
            return response()->json(['message' => 'This coupon is no longer active.'], 400);
        }
        
        if ($coupon->valid_until && now()->gt($coupon->valid_until)) {
            return response()->json(['message' => 'This coupon has expired.'], 400);
        }
        
        return response()->json($coupon);
    }
}
