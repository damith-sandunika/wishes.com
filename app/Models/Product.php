<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'images',
        'brand',
        'supplier_id',
        'expiry_date',
        'batch_number',
        'tags',
        'weight',
        'unit_type',
        'min_quantity',
        'max_quantity',
        'current_stock',
        'low_stock_limit',
        'buying_price',
        'selling_price',
        'discount_price',
        'status',
        'stock_availability',
        'color_variations',
        'enable_personalization',
        'enable_wrapping',
        'allowed_addons',
        'occasions',
    ];

    protected $casts = [
        'images' => 'array',
        'color_variations' => 'array',
        'allowed_addons' => 'array',
        'occasions' => 'array',
        'enable_personalization' => 'boolean',
        'enable_wrapping' => 'boolean',
        'status' => 'boolean',
        'stock_availability' => 'boolean',
        'current_stock' => 'integer',
        'selling_price' => 'float',
        'discount_price' => 'float',
        'buying_price' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }
}
