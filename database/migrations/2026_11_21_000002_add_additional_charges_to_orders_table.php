<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orders') && !Schema::hasColumn('orders', 'additional_charge')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->decimal('additional_charge', 10, 2)->default(0)->after('delivery_charge');
                $table->string('additional_charge_note')->nullable()->after('additional_charge');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('orders') && Schema::hasColumn('orders', 'additional_charge')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn(['additional_charge', 'additional_charge_note']);
            });
        }
    }
};
