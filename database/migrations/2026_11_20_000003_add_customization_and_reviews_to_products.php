<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('color_variations')->nullable()->after('images');
            $table->boolean('enable_personalization')->default(false)->after('color_variations');
            $table->boolean('enable_wrapping')->default(true)->after('enable_personalization');
            $table->json('allowed_addons')->nullable()->after('enable_wrapping');
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_name');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('title')->nullable();
            $table->text('content');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();

            $table->index(['product_id', 'is_approved']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'color_variations',
                'enable_personalization',
                'enable_wrapping',
                'allowed_addons',
            ]);
        });
    }
};
