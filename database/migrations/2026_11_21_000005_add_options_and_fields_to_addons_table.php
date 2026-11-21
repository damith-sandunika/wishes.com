<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addons', function (Blueprint $table) {
            if (!Schema::hasColumn('addons', 'options')) {
                $table->json('options')->nullable()->after('price');
            }
            if (!Schema::hasColumn('addons', 'custom_fields')) {
                $table->json('custom_fields')->nullable()->after('options');
            }
        });
    }

    public function down(): void
    {
        Schema::table('addons', function (Blueprint $table) {
            $table->dropColumn(['options', 'custom_fields']);
        });
    }
};
