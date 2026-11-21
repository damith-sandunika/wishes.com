<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Actions\Coupons\ValidateCouponAction;
use App\Enums\DeliveryMethod;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Jobs\SendWhatsAppOrderNotification;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\Setting;
use App\Models\StockLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateOrderAction
{
    public function __construct(
        protected ValidateCouponAction $validateCouponAction,
        protected ResolveOrderCustomerAction $resolveCustomerAction
    ) {}

    public function execute(array $data, ?string $paymentSlip = null): Order
    {
        return DB::transaction(function () use ($data, $paymentSlip) {
            $itemsData = $data['items'] ?? [];
            if (empty($itemsData)) {
                throw ValidationException::withMessages(['items' => 'Order must contain at least one item.']);
            }

            // 1. DEADLOCK PREVENTION: Deterministically sort items by product_id
            usort($itemsData, fn($a, $b) => (int)$a['product_id'] <=> (int)$b['product_id']);

            $computedSubTotal = 0.0;
            $orderItemsToInsert = [];
            $stockLogsToInsert = [];

            foreach ($itemsData as $item) {
                $productId = (int)$item['product_id'];
                $quantity = max(1, (int)($item['quantity'] ?? 1));

                $product = Product::where('id', $productId)->lockForUpdate()->first();
                if (!$product || !$product->status) {
                    $name = $item['product_name'] ?? ('Product #' . $productId);
                    throw ValidationException::withMessages(['items' => "Product '{$name}' is currently unavailable."]);
                }

                if ($product->current_stock !== null && $product->current_stock < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock for '{$product->name}'. Available: {$product->current_stock}, requested: {$quantity}"
                    ]);
                }

                $effectivePrice = $product->effective_price;
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

                $stockLogsToInsert[] = [
                    'product_id' => $product->id,
                    'type' => 'sale',
                    'quantity' => -$quantity,
                    'unit_cost' => $product->buying_price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 2. SERVER-SIDE COUPON VALIDATION
            $discountAmount = 0.0;
            $couponCode = null;
            if (!empty($data['coupon_code'])) {
                $couponResult = $this->validateCouponAction->execute((string)$data['coupon_code'], $computedSubTotal);
                $couponCode = $couponResult['coupon']->code;
                $discountAmount = $couponResult['discount_amount'];
            }

            // 3. SERVER-SIDE DELIVERY CHARGE CALCULATION
            $deliveryMethodStr = strtolower(trim((string)($data['delivery_method'] ?? 'standard')));
            $deliveryMethod = DeliveryMethod::tryFrom($deliveryMethodStr) ?? DeliveryMethod::STANDARD;
            $freeThreshold = (float)(Setting::get('free_delivery_above', 5000));
            $standardFee = (float)(Setting::get('delivery_charge', 350));

            $deliveryCharge = match ($deliveryMethod) {
                DeliveryMethod::SAMEDAY => 750.0,
                default => ($computedSubTotal >= $freeThreshold) ? 0.0 : $standardFee,
            };

            $grandTotal = max(0.0, round($computedSubTotal + $deliveryCharge - $discountAmount, 2));

            // 4. USER ASSOCIATION VIA ACTION
            $currentUserId = auth('sanctum')->id() ?? auth()->id();
            [$userId, $createdUser, $token] = $this->resolveCustomerAction->execute($data, $currentUserId);

            // 5. ORDER CREATION
            $trackingNumber = 'WSH-TRK-' . strtoupper(Str::random(8));
            $invoiceNumber = 'WSH-INV-' . strtoupper(Str::random(6));

            $order = Order::create([
                'user_id' => $userId,
                'tracking_number' => $trackingNumber,
                'invoice_number' => $invoiceNumber,
                'customer_name' => (string)$data['customer_name'],
                'whatsapp_number' => (string)$data['whatsapp_number'],
                'recipient_name' => (string)($data['recipient_name'] ?? $data['customer_name']),
                'recipient_phone' => (string)($data['recipient_phone'] ?? $data['whatsapp_number']),
                'delivery_address' => (string)$data['delivery_address'],
                'delivery_date' => !empty($data['delivery_date']) ? $data['delivery_date'] : null,
                'delivery_time_slot' => $data['delivery_time_slot'] ?? $data['delivery_time'] ?? null,
                'payment_method' => (string)($data['payment_method'] ?? 'Cash On Delivery'),
                'payment_status' => PaymentStatus::PENDING->value,
                'delivery_status' => OrderStatus::PENDING->value,
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

            foreach ($stockLogsToInsert as $log) {
                $log['notes'] = "Sold in Order #{$invoiceNumber}";
                StockLog::create($log);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'user_id' => $userId,
                'from_status' => null,
                'to_status' => OrderStatus::PENDING->value,
                'notes' => 'Order placed successfully by customer.',
            ]);

            SendWhatsAppOrderNotification::dispatch($order->id, 'wa_order_template', true);

            Log::info('order.placed', [
                'order_id' => $order->id,
                'invoice' => $order->invoice_number,
                'grand_total' => $order->grand_total,
                'user_id' => $userId,
            ]);

            if ($createdUser) {
                $order->setAttribute('user', $createdUser);
                $order->setAttribute('token', $token);
            }

            return $order->load(['items', 'statusHistories']);
        });
    }
}
