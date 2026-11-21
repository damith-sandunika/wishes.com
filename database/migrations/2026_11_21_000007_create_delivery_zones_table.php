<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->decimal('rate', 10, 2)->default(0);
            $table->string('estimated_time', 100)->nullable();
            $table->json('districts')->nullable();
            $table->decimal('free_delivery_above', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed initial realistic Sri Lanka delivery zones
        DB::table('delivery_zones')->insert([
            [
                'name' => 'Colombo City & Suburbs (Same-Day / Express)',
                'rate' => 350.00,
                'estimated_time' => 'Same-Day (2 – 4 Hours)',
                'districts' => json_encode(['Colombo']),
                'free_delivery_above' => 7500.00,
                'description' => 'Fast delivery within Colombo municipal and immediate suburbs.',
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Western Province (Gampaha & Kalutara)',
                'rate' => 500.00,
                'estimated_time' => 'Next-Day Delivery',
                'districts' => json_encode(['Gampaha', 'Kalutara']),
                'free_delivery_above' => 10000.00,
                'description' => 'Standard delivery across Gampaha, Negombo, Kalutara, and Panadura.',
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Islandwide Outstation (All Other 22 Districts)',
                'rate' => 650.00,
                'estimated_time' => '2 – 3 Business Days',
                'districts' => json_encode([
                    'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota',
                    'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
                    'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
                    'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'
                ]),
                'free_delivery_above' => 12000.00,
                'description' => 'Reliable courier delivery to any location in Sri Lanka.',
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Overseas & International Shipping',
                'rate' => 4500.00,
                'estimated_time' => '4 – 7 Business Days (Air Express)',
                'districts' => json_encode(['International / Overseas']),
                'free_delivery_above' => null,
                'description' => 'DHL / FedEx express gift dispatch to global destinations.',
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_zones');
    }
};
