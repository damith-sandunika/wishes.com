<?php

namespace App\Services\WhatsApp;

use App\Models\Order;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected ?string $apiUrl;
    protected ?string $apiToken;
    protected ?string $instanceId;
    protected ?string $adminNumber;
    protected bool $enabled;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url') 
            ?: Setting::where('key', 'whatsapp_api_url')->value('value');
        $this->apiToken = config('services.whatsapp.api_token') 
            ?: Setting::where('key', 'whatsapp_api_token')->value('value');
        $this->instanceId = config('services.whatsapp.instance_id') 
            ?: Setting::where('key', 'whatsapp_instance_id')->value('value');
        $this->adminNumber = config('services.whatsapp.admin_number') 
            ?: Setting::where('key', 'whatsapp_number')->value('value');
        
        $enabledSetting = Setting::where('key', 'whatsapp_enabled')->value('value');
        $this->enabled = $enabledSetting !== null ? (bool)$enabledSetting : true;
    }

    public function send(string $recipientPhone, string $message): bool
    {
        $phone = $this->formatPhoneNumber($recipientPhone);

        if (!$this->enabled) {
            Log::info("WhatsApp disabled. Message skipped for {$phone}: {$message}");
            return false;
        }

        // If no external API URL configured yet, log safely and use local proxy if present
        if (empty($this->apiUrl)) {
            Log::channel('single')->info("WhatsApp [PENDING_CREDENTIALS] to {$phone}:\n{$message}");
            
            // Try local whatsapp-server fallback if running
            try {
                $response = Http::timeout(3)->post('http://127.0.0.1:3006/send', [
                    'number' => $phone,
                    'message' => $message,
                ]);
                return $response->successful();
            } catch (\Exception $e) {
                return false;
            }
        }

        try {
            $headers = ['Accept' => 'application/json'];
            if ($this->apiToken) {
                $headers['Authorization'] = "Bearer {$this->apiToken}";
                $headers['apikey'] = $this->apiToken;
            }

            $payload = [
                'recipient' => $phone,
                'number' => $phone,
                'to' => $phone,
                'phone' => $phone,
                'message' => $message,
                'body' => $message,
                'instance_id' => $this->instanceId,
            ];

            $response = Http::timeout(10)->withHeaders($headers)->post($this->apiUrl, $payload);
            
            if ($response->successful()) {
                Log::info("WhatsApp sent successfully to {$phone}");
                return true;
            }

            Log::warning("WhatsApp API responded with status {$response->status()} for {$phone}: " . $response->body());
            return false;
        } catch (\Exception $e) {
            Log::error("WhatsApp API dispatch error to {$phone}: " . $e->getMessage());
            return false;
        }
    }

    public function sendOrderNotification(Order $order, string $templateKey): bool
    {
        $template = Setting::where('key', $templateKey)->value('value');
        if (!$template) {
            $template = $this->getDefaultTemplate($templateKey);
        }

        $message = str_replace(
            [
                '{{customer_name}}',
                '{{recipient_name}}',
                '{{invoice}}',
                '{{total}}',
                '{{address}}',
                '{{delivery_date}}',
                '{{tracking}}',
            ],
            [
                $order->customer_name,
                $order->recipient_name ?: $order->customer_name,
                $order->invoice_number,
                number_format($order->grand_total, 2),
                $order->delivery_address,
                $order->delivery_date ?: 'Next available slot',
                $order->tracking_number,
            ],
            $template
        );

        $phone = $order->whatsapp_number;
        return $this->send($phone, $message);
    }

    public function sendAdminAlert(Order $order): bool
    {
        if (empty($this->adminNumber)) {
            return false;
        }

        $message = "🔔 *New Gift Order Received - Wishes.com*\n\n"
            . "📦 *Invoice:* {$order->invoice_number}\n"
            . "👤 *Customer:* {$order->customer_name}\n"
            . "🎁 *Recipient:* " . ($order->recipient_name ?: 'Same as customer') . "\n"
            . "💰 *Total:* LKR " . number_format($order->grand_total, 2) . "\n"
            . "📅 *Delivery Date:* " . ($order->delivery_date ?: 'Standard') . " (" . ($order->delivery_time_slot ?: 'All Day') . ")\n"
            . "💳 *Payment:* {$order->payment_method}\n\n"
            . "Check your admin dashboard to process this order.";

        return $this->send($this->adminNumber, $message);
    }

    protected function formatPhoneNumber(string $number): string
    {
        $clean = preg_replace('/[^0-9]/', '', $number);
        if (str_starts_with($clean, '0') && strlen($clean) === 10) {
            return '94' . substr($clean, 1);
        }
        if (strlen($clean) === 9) {
            return '94' . $clean;
        }
        return $clean;
    }

    protected function getDefaultTemplate(string $key): string
    {
        return match ($key) {
            'wa_order_template' => "Hello {{customer_name}},\n\nYour gift order ({{invoice}}) has been placed successfully at *Wishes.com*!\nTotal: LKR {{total}}\nDelivery Address: {{address}}\n\nWe will notify you when it's out for delivery. Track: {{tracking}}\n\nThank you for choosing Wishes.com! 🎁",
            'wa_confirm_template' => "Hi {{customer_name}},\n\nGreat news! Your gift order ({{invoice}}) is *Confirmed* and is being hand-crafted with care. 💐\n\nWishes.com",
            'wa_delivery_template' => "Hi {{customer_name}},\n\nYour gift ({{invoice}}) is *Out for Delivery*! 🚚 Our courier will arrive soon.\n\nWishes.com",
            'wa_completed_template' => "Hi {{customer_name}},\n\nYour gift ({{invoice}}) has been *Delivered* successfully! 🎉 We hope it brings a big smile to your loved one.\n\nWishes.com",
            'wa_cancelled_template' => "Hi {{customer_name}},\n\nYour order ({{invoice}}) has been cancelled. For any inquiries, please contact +94 71 808 0582.\n\nWishes.com",
            default => "Update for your order {{invoice}} at Wishes.com.",
        };
    }
}
