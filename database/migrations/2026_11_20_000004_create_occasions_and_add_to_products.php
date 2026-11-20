<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('occasions')) {
            Schema::create('occasions', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('icon')->default('Gift');
                $table->string('image')->nullable();
                $table->string('bg_gradient')->default('from-pink-500 to-rose-600');
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        if (Schema::hasTable('products') && !Schema::hasColumn('products', 'occasions')) {
            Schema::table('products', function (Blueprint $table) {
                $table->json('occasions')->nullable()->after('allowed_addons');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('occasions');
        if (Schema::hasColumn('products', 'occasions')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('occasions');
            });
        }
    }
};
