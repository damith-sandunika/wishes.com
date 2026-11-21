<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tracking_number',
        'invoice_number',
        'customer_name',
        'whatsapp_number',
        'recipient_name',
        'recipient_phone',
        'delivery_address',
        'delivery_date',
        'delivery_time_slot',
        'province',
        'district',
        'city',
        'latitude',
        'longitude',
        'payment_method',
        'payment_status',
        'delivery_status',
        'delivery_charge',
        'additional_charge',
        'additional_charge_note',
        'sub_total',
        'discount_amount',
        'coupon_code',
        'grand_total',
        'order_notes',
        'gift_message',
        'gift_wrapping',
        'payment_slip',
    ];

    protected $casts = [
        'delivery_charge' => 'decimal:2',
        'additional_charge' => 'decimal:2',
        'sub_total' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'gift_wrapping' => 'boolean',
        'delivery_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }
}
