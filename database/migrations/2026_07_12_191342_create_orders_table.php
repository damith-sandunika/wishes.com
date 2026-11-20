<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tracking_number')->unique();
            $table->string('invoice_number')->unique();
            $table->string('customer_name');
            $table->string('whatsapp_number');
            $table->text('delivery_address');
            $table->string('province')->nullable();
            $table->string('district')->nullable();
            $table->string('city')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('payment_method')->default('Cash On Delivery');
            $table->string('payment_status')->default('Pending');
            $table->string('delivery_status')->default('Pending');
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('sub_total', 10, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('coupon_code')->nullable();
            $table->decimal('grand_total', 10, 2)->default(0);
            $table->text('order_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
