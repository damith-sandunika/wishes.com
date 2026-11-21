<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rate',
        'estimated_time',
        'districts',
        'free_delivery_above',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'rate' => 'float',
        'free_delivery_above' => 'float',
        'districts' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
