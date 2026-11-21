<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_percent',
        'discount_amount',
        'max_discount',
        'min_spend',
        'is_active',
        'is_flash_sale',
        'banner_text',
        'valid_until',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_flash_sale' => 'boolean',
        'discount_percent' => 'float',
        'discount_amount' => 'float',
        'max_discount' => 'float',
        'min_spend' => 'float',
        'valid_until' => 'date',
    ];
}
