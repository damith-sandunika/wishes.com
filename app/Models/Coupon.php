<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code', 'discount_percent', 'max_discount', 'is_active', 'valid_until'];

    protected $casts = [
        'is_active' => 'boolean',
        'discount_percent' => 'float',
        'max_discount' => 'float',
        'valid_until' => 'date',
    ];
}
