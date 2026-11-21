<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'free_items',
        'occasions',
    ];

    protected $casts = [
        'images' => 'array',
        'color_variations' => 'array',
        'allowed_addons' => 'array',
        'free_items' => 'array',
        'occasions' => 'array',
        'enable_personalization' => 'boolean',
        'enable_wrapping' => 'boolean',
        'status' => 'boolean',
        'stock_availability' => 'boolean',
        'current_stock' => 'integer',
        'selling_price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'buying_price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('is_approved', true)->latest();
    }

    public function stockLogs(): HasMany
    {
        return $this->hasMany(StockLog::class)->latest();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', true);
    }

    public function getEffectivePriceAttribute(): float
    {
        $discount = (float)$this->discount_price;
        $selling = (float)$this->selling_price;
        return ($discount > 0 && $discount < $selling) ? $discount : $selling;
    }
}
