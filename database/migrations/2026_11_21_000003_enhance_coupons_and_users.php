<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('coupons')) {
            Schema::table('coupons', function (Blueprint $table) {
                if (!Schema::hasColumn('coupons', 'discount_type')) {
                    $table->string('discount_type')->default('percent')->after('code'); // percent, fixed, free_delivery
                }
                if (!Schema::hasColumn('coupons', 'discount_amount')) {
                    $table->decimal('discount_amount', 10, 2)->nullable()->after('discount_percent');
                }
                if (!Schema::hasColumn('coupons', 'min_spend')) {
                    $table->decimal('min_spend', 10, 2)->nullable()->after('max_discount');
                }
                if (!Schema::hasColumn('coupons', 'is_flash_sale')) {
                    $table->boolean('is_flash_sale')->default(false)->after('is_active');
                }
                if (!Schema::hasColumn('coupons', 'banner_text')) {
                    $table->string('banner_text')->nullable()->after('is_flash_sale');
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone')->nullable()->after('email');
                }
                if (!Schema::hasColumn('users', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('role');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('coupons')) {
            Schema::table('coupons', function (Blueprint $table) {
                $columns = ['discount_type', 'discount_amount', 'min_spend', 'is_flash_sale', 'banner_text'];
                foreach ($columns as $column) {
                    if (Schema::hasColumn('coupons', $column)) {
                        $table->dropColumn($column);
                    }
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'phone')) {
                    $table->dropColumn('phone');
                }
                if (Schema::hasColumn('users', 'is_active')) {
                    $table->dropColumn('is_active');
                }
            });
        }
    }
};
