<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Addon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'is_price_editable',
        'type',
        'options',
        'custom_fields',
        'image',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'float',
        'is_price_editable' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'options' => 'array',
        'custom_fields' => 'array',
    ];
}
