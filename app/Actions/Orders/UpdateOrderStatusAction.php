<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Jobs\SendWhatsAppOrderNotification;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateOrderStatusAction
{
    public function execute(Order $order, array $attributes, ?User $actor = null): Order
    {
        return DB::transaction(function () use ($order, $attributes, $actor) {
            $fromDeliveryStatus = $order->delivery_status;
            $toDeliveryStatus = $attributes['delivery_status'] ?? $fromDeliveryStatus;
            $statusChanged = isset($attributes['delivery_status']) && ($attributes['delivery_status'] !== $fromDeliveryStatus);

            $order->update($attributes);

            // 1. Audit trail logging
            if ($statusChanged || isset($attributes['payment_status'])) {
                $notes = [];
                if ($statusChanged) {
                    $notes[] = "Delivery status changed from '{$fromDeliveryStatus}' to '{$toDeliveryStatus}'";
                }
                if (isset($attributes['payment_status']) && $attributes['payment_status'] !== $order->getOriginal('payment_status')) {
                    $notes[] = "Payment status updated to '{$attributes['payment_status']}'";
                }

                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'user_id' => $actor?->id,
                    'from_status' => $fromDeliveryStatus,
                    'to_status' => $toDeliveryStatus,
                    'notes' => implode(' | ', $notes),
                ]);
            }

            // 2. Automated WhatsApp notifications based on status transition
            if ($statusChanged) {
                $templateKey = match ($toDeliveryStatus) {
                    'Confirmed' => 'wa_confirm_template',
                    'Delivered' => 'wa_delivery_template',
                    'Completed' => 'wa_completed_template',
                    'Cancelled' => 'wa_cancelled_template',
                    default => null,
                };

                if ($templateKey) {
                    SendWhatsAppOrderNotification::dispatch($order->id, $templateKey);
                }

                // 3. Security cleanup: Delete sensitive customer payment slips after order completion/delivery
                if (in_array($toDeliveryStatus, ['Delivered', 'Completed'], true) && $order->payment_slip) {
                    if (Storage::disk('private')->exists($order->payment_slip)) {
                        Storage::disk('private')->delete($order->payment_slip);
                    } elseif (Storage::disk('public')->exists($order->payment_slip)) {
                        Storage::disk('public')->delete($order->payment_slip);
                    }
                    $order->update(['payment_slip' => null]);
                }
            }

            return $order->fresh(['items', 'statusHistories']);
        });
    }
}
