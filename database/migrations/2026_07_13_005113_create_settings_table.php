<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // Seed defaults
        $defaults = [
            // General
            ['key' => 'shop_name',           'value' => 'Win Lion Agro Products',  'group' => 'general'],
            ['key' => 'shop_email',          'value' => 'info@winlion.com',         'group' => 'general'],
            ['key' => 'shop_phone',          'value' => '+94 77 123 4567',          'group' => 'general'],
            ['key' => 'shop_address',        'value' => 'Colombo, Sri Lanka',       'group' => 'general'],
            ['key' => 'shop_currency',       'value' => 'Rs.',                      'group' => 'general'],
            ['key' => 'shop_logo',           'value' => null,                       'group' => 'general'],

            // Delivery
            ['key' => 'delivery_charge',     'value' => '350',                      'group' => 'delivery'],
            ['key' => 'free_delivery_above', 'value' => '2000',                     'group' => 'delivery'],
            ['key' => 'delivery_note',       'value' => 'Delivery within 1-3 days', 'group' => 'delivery'],

            // Payment
            ['key' => 'cod_enabled',         'value' => '1',                        'group' => 'payment'],
            ['key' => 'bank_enabled',        'value' => '1',                        'group' => 'payment'],
            ['key' => 'bank_name',           'value' => 'Commercial Bank',          'group' => 'payment'],
            ['key' => 'bank_branch',         'value' => 'Colombo',                  'group' => 'payment'],
            ['key' => 'bank_account_name',   'value' => 'Win Lion Agro Products',   'group' => 'payment'],
            ['key' => 'bank_account_number', 'value' => '1234567890',               'group' => 'payment'],

            // WhatsApp
            ['key' => 'whatsapp_number',     'value' => '+94771234567',             'group' => 'whatsapp'],
            ['key' => 'wa_order_template',   'value' => "Hi {{customer_name}}! 🌿\n\nThank you for your order at *Win Lion Agro Products*.\n\n📦 *Order:* {{invoice}}\n💰 *Total:* Rs.{{total}}\n📍 *Delivery:* {{address}}\n\nWe'll deliver within 1-3 days. Track: {{tracking}}\n\nThank you! 🙏", 'group' => 'whatsapp'],
            ['key' => 'wa_confirm_template', 'value' => "Hi {{customer_name}}! ✅\n\nYour order *{{invoice}}* has been confirmed and is being prepared.\n\nExpected delivery: 1-3 business days.\n\nFor queries: +94771234567", 'group' => 'whatsapp'],
            ['key' => 'wa_delivery_template','value' => "Hi {{customer_name}}! 🚚\n\nGreat news! Your order *{{invoice}}* is out for delivery.\n\nOur team will reach you shortly.\n\n*Win Lion Agro Products* 🌿", 'group' => 'whatsapp'],
        ];

        DB::table('settings')->insert($defaults);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
