<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->date('expiry_date')->nullable()->after('current_stock');
            $table->string('batch_number')->nullable()->after('expiry_date');
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete()->after('category_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['expiry_date', 'batch_number', 'supplier_id']);
        });
    }
};
