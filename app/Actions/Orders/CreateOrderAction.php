<?php

namespace App\Actions\Orders;

use App\Jobs\SendWhatsAppOrderNotification;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrderAction
{
    public function execute(array $data, ?string $paymentSlip = null): Order
    {
        return DB::transaction(function () use ($data, $paymentSlip) {
            $itemsData = $data['items'] ?? [];
            if (empty($itemsData)) {
                throw ValidationException::withMessages(['items' => 'Order must contain at least one item.']);
            }

            $computedSubTotal = 0.0;
            $orderItemsToInsert = [];

            foreach ($itemsData as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();
                if (!$product || !$product->status) {
                    throw ValidationException::withMessages(['items' => "Product '{$item['product_name']}' is unavailable."]);
                }

                $quantity = max(1, (int)$item['quantity']);
                if ($product->current_stock !== null && $product->current_stock < $quantity) {
                    throw ValidationException::withMessages(['items' => "Insufficient stock for '{$product->name}'. Available: {$product->current_stock}"]);
                }

                $effectivePrice = ($product->discount_price > 0 && $product->discount_price < $product->selling_price)
                    ? (float)$product->discount_price
                    : (float)$product->selling_price;

                $itemTotal = round($effectivePrice * $quantity, 2);
                $computedSubTotal += $itemTotal;

                $product->decrement('current_stock', $quantity);
                if ($product->fresh()->current_stock <= 0) {
                    $product->update(['stock_availability' => false]);
                }

                $orderItemsToInsert[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $quantity,
                    'unit_price' => $effectivePrice,
                    'total_price' => $itemTotal,
                ];
            }

            $discountAmount = 0.0;
            $couponCode = null;
            if (!empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', $data['coupon_code'])->where('is_active', true)->first();
                if ($coupon && (!$coupon->valid_until || now()->lte($coupon->valid_until))) {
                    $couponCode = $coupon->code;
                    $calcDiscount = ($computedSubTotal * $coupon->discount_percent) / 100;
                    if ($coupon->max_discount && $calcDiscount > $coupon->max_discount) {
                        $calcDiscount = (float)$coupon->max_discount;
                    }
                    $discountAmount = min($calcDiscount, $computedSubTotal);
                }
            }

            $deliveryMethod = $data['delivery_method'] ?? 'standard';
            $defaultDeliveryFee = ($deliveryMethod === 'sameday') ? 750.0 : 350.0;
            $deliveryCharge = ($computedSubTotal > 5000) ? 0.0 : (isset($data['delivery_charge']) ? (float)$data['delivery_charge'] : $defaultDeliveryFee);
            $grandTotal = max(0.0, round($computedSubTotal + $deliveryCharge - $discountAmount, 2));

            $userId = auth('sanctum')->id() ?? auth()->id();
            $createdUser = null;
            $token = null;

            if (!empty($data['sender_email'])) {
                if (!$userId && (!empty($data['password']) || !empty($data['create_account']))) {
                    $existing = \App\Models\User::where('email', $data['sender_email'])->first();
                    if ($existing) {
                        $userId = $existing->id;
                        $createdUser = $existing;
                    } else {
                        $pwd = !empty($data['password']) ? $data['password'] : Str::random(10);
                        $createdUser = \App\Models\User::create([
                            'name' => $data['customer_name'],
                            'email' => $data['sender_email'],
                            'password' => \Illuminate\Support\Facades\Hash::make($pwd),
                        ]);
                        $userId = $createdUser->id;
                    }
                    $token = $createdUser->createToken('customer_token')->plainTextToken;
                } elseif (!$userId) {
                    $existing = \App\Models\User::where('email', $data['sender_email'])->first();
                    if ($existing) $userId = $existing->id;
                }
            }

            $order = Order::create([
                'user_id' => $userId,
                'tracking_number' => 'WSH-TRK-' . strtoupper(Str::random(8)),
                'invoice_number' => 'WSH-INV-' . strtoupper(Str::random(6)),
                'customer_name' => $data['customer_name'],
                'whatsapp_number' => $data['whatsapp_number'],
                'recipient_name' => $data['recipient_name'] ?? $data['customer_name'],
                'recipient_phone' => $data['recipient_phone'] ?? $data['whatsapp_number'],
                'delivery_address' => $data['delivery_address'],
                'delivery_date' => !empty($data['delivery_date']) ? $data['delivery_date'] : null,
                'delivery_time_slot' => $data['delivery_time_slot'] ?? $data['delivery_time'] ?? null,
                'province' => $data['province'] ?? null,
                'district' => $data['district'] ?? null,
                'city' => $data['city'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'payment_method' => $data['payment_method'] ?? 'Cash On Delivery',
                'payment_status' => 'Pending',
                'delivery_status' => 'Pending',
                'delivery_charge' => $deliveryCharge,
                'sub_total' => round($computedSubTotal, 2),
                'discount_amount' => round($discountAmount, 2),
                'coupon_code' => $couponCode,
                'grand_total' => $grandTotal,
                'order_notes' => $data['order_notes'] ?? null,
                'gift_message' => $data['gift_message'] ?? null,
                'gift_wrapping' => !empty($data['gift_wrapping']),
                'payment_slip' => $paymentSlip,
            ]);

            foreach ($orderItemsToInsert as $item) {
                $order->items()->create($item);
            }

            // Asynchronous WhatsApp notifications dispatching
            SendWhatsAppOrderNotification::dispatch($order->id, 'wa_order_template', true);

            if ($createdUser) {
                $order->setAttribute('user', $createdUser);
                $order->setAttribute('token', $token);
            }

            return $order->load('items');
        });
    }
}
