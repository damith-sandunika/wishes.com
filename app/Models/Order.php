<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'delivery_charge' => 'float',
        'sub_total' => 'float',
        'discount_amount' => 'float',
        'grand_total' => 'float',
        'gift_wrapping' => 'boolean',
        'delivery_date' => 'date',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
