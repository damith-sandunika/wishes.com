<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class GiftServicesSeeder extends Seeder
{
    public function run(): void
    {
        $defaultWrappings = [
            ['id' => 'purple', 'name' => 'Classic Luxury Purple', 'code' => '#8b5cf6', 'price' => 0, 'active' => true],
            ['id' => 'pink', 'name' => 'Romantic Pastel Pink', 'code' => '#f472b6', 'price' => 250, 'active' => true],
            ['id' => 'gold', 'name' => 'Royal Gold & Cream', 'code' => '#f59e0b', 'price' => 350, 'active' => true],
            ['id' => 'red', 'name' => 'Velvet Festive Red', 'code' => '#dc2626', 'price' => 300, 'active' => true],
            ['id' => 'kraft', 'name' => 'Minimalist Eco Kraft', 'code' => '#d97706', 'price' => 0, 'active' => true],
        ];

        $defaultAddons = [
            ['id' => 'card', 'name' => 'Handwritten Greeting Card', 'price' => 350, 'icon' => '💌', 'active' => true],
            ['id' => 'teddy', 'name' => 'Mini Cuddle Teddy Bear', 'price' => 1500, 'icon' => '🧸', 'active' => true],
            ['id' => 'ferrero', 'name' => 'Ferrero Rocher Box (3 pcs)', 'price' => 950, 'icon' => '🍫', 'active' => true],
            ['id' => 'candle', 'name' => 'Scented Vanilla Candle', 'price' => 1200, 'icon' => '🕯️', 'active' => true],
            ['id' => 'lights', 'name' => 'Warm LED Fairy Lights', 'price' => 650, 'icon' => '✨', 'active' => true],
        ];

        Setting::updateOrCreate(
            ['key' => 'gift_wrapping_options'],
            ['value' => json_encode($defaultWrappings), 'group' => 'gift']
        );

        Setting::updateOrCreate(
            ['key' => 'gift_addons_options'],
            ['value' => json_encode($defaultAddons), 'group' => 'gift']
        );
    }
}
