<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\WhatsApp\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppOrderNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [10, 30, 60];

    public function __construct(
        public int $orderId,
        public string $templateKey = 'wa_order_template',
        public bool $notifyAdmin = false
    ) {}

    public function handle(WhatsAppService $service): void
    {
        $order = Order::find($this->orderId);
        if (!$order) {
            Log::warning("WhatsApp Job skipped: Order #{$this->orderId} not found.");
            return;
        }

        // Send customer notification
        $service->sendOrderNotification($order, $this->templateKey);

        // Send admin notification if requested (e.g. on new order placement)
        if ($this->notifyAdmin) {
            $service->sendAdminAlert($order);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("WhatsApp Notification Job permanently failed for Order #{$this->orderId}: " . $exception->getMessage());
    }
}
