<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('recipient_name')->nullable()->after('whatsapp_number');
            $table->string('recipient_phone')->nullable()->after('recipient_name');
            $table->date('delivery_date')->nullable()->after('delivery_address');
            $table->string('delivery_time_slot')->nullable()->after('delivery_date');
            $table->text('gift_message')->nullable()->after('order_notes');
            $table->boolean('gift_wrapping')->default(false)->after('gift_message');

            $table->index(['created_at', 'delivery_status']);
            $table->index('payment_status');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['status', 'selling_price']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index(['status', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['created_at', 'delivery_status']);
            $table->dropIndex(['payment_status']);
            $table->dropColumn([
                'recipient_name',
                'recipient_phone',
                'delivery_date',
                'delivery_time_slot',
                'gift_message',
                'gift_wrapping'
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['status', 'selling_price']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['status', 'sort_order']);
        });
    }
};
