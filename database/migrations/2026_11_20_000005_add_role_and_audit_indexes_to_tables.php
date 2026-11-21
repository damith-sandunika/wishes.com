<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add role to users table if not exists
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('customer')->after('password')->index();
            });
        }

        // 2. Create order_status_histories for complete audit trail
        if (!Schema::hasTable('order_status_histories')) {
            Schema::create('order_status_histories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('from_status')->nullable();
                $table->string('to_status');
                $table->text('notes')->nullable();
                $table->timestamps();

                $table->index(['order_id', 'created_at']);
            });
        }

        // 3. Add high-performance indexes for 1000 orders/day scale
        Schema::table('orders', function (Blueprint $table) {
            $table->index('whatsapp_number');
            $table->index('delivery_date');
            $table->index(['user_id', 'created_at']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->index('product_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index(['category_id', 'status']);
        });

        Schema::table('stock_logs', function (Blueprint $table) {
            $table->index(['product_id', 'type', 'created_at']);
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }

        Schema::dropIfExists('order_status_histories');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['whatsapp_number']);
            $table->dropIndex(['delivery_date']);
            $table->dropIndex(['user_id', 'created_at']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropIndex(['product_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['category_id', 'status']);
        });

        Schema::table('stock_logs', function (Blueprint $table) {
            $table->dropIndex(['product_id', 'type', 'created_at']);
        });
    }
};
