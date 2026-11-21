<?php

declare(strict_types=1);

namespace App\Actions\Coupons;

use App\Models\Coupon;
use Illuminate\Validation\ValidationException;

class ValidateCouponAction
{
    /**
     * @return array{coupon: Coupon, discount_amount: float, is_free_delivery: bool}
     * @throws ValidationException
     */
    public function execute(string $code, float $subTotal): array
    {
        $code = trim($code);
        if (empty($code)) {
            throw ValidationException::withMessages(['coupon_code' => 'Coupon code is required.']);
        }

        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            throw ValidationException::withMessages(['coupon_code' => 'Invalid coupon code.']);
        }

        if (!$coupon->is_active) {
            throw ValidationException::withMessages(['coupon_code' => 'This coupon is no longer active.']);
        }

        if ($coupon->valid_until && now()->gt($coupon->valid_until)) {
            throw ValidationException::withMessages(['coupon_code' => 'This coupon has expired.']);
        }

        if ($coupon->min_spend && $subTotal < (float)$coupon->min_spend) {
            throw ValidationException::withMessages([
                'coupon_code' => 'Minimum order amount of Rs. ' . number_format((float)$coupon->min_spend) . ' required to use this coupon.'
            ]);
        }

        $discountType = $coupon->discount_type ?? 'percent';
        $discountAmount = 0.0;
        $isFreeDelivery = false;

        if ($discountType === 'free_delivery') {
            $isFreeDelivery = true;
            $discountAmount = 0.0;
        } elseif ($discountType === 'fixed') {
            $discountAmount = min((float)($coupon->discount_amount ?? 0), $subTotal);
        } else {
            $calcDiscount = ($subTotal * (float)($coupon->discount_percent ?? 0)) / 100;
            if ($coupon->max_discount && $calcDiscount > (float)$coupon->max_discount) {
                $calcDiscount = (float)$coupon->max_discount;
            }
            $discountAmount = min($calcDiscount, $subTotal);
        }

        return [
            'coupon' => $coupon,
            'discount_amount' => round($discountAmount, 2),
            'is_free_delivery' => $isFreeDelivery,
        ];
    }
}
