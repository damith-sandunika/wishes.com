<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Coupons\ValidateCouponAction;
use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'discount_type' => 'required|in:percent,fixed,free_delivery',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'is_flash_sale' => 'boolean',
            'banner_text' => 'nullable|string|max:255',
            'valid_until' => 'nullable|date',
            'is_active' => 'boolean'
        ]);

        $validated['code'] = strtoupper(trim($validated['code']));
        $coupon = Coupon::create($validated);

        return response()->json($coupon, 201);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted successfully.']);
    }

    public function validateCoupon(Request $request, ValidateCouponAction $validateCouponAction)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'sub_total' => 'nullable|numeric|min:0',
        ]);

        $subTotal = (float)$request->get('sub_total', 1000);

        try {
            $result = $validateCouponAction->execute((string)$request->code, $subTotal);
            return response()->json([
                ...$result['coupon']->toArray(),
                'calculated_discount' => $result['discount_amount'],
                'is_free_delivery' => $result['is_free_delivery'],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->validator->errors()->first()
            ], 400);
        }
    }

    public function activeBanner()
    {
        $flash = Coupon::where('is_active', true)
            ->where('is_flash_sale', true)
            ->whereNotNull('banner_text')
            ->where(function ($q) {
                $q->whereNull('valid_until')->orWhere('valid_until', '>=', now()->toDateString());
            })
            ->latest()
            ->first();

        return response()->json($flash);
    }
}
