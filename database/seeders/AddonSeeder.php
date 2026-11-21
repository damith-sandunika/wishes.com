<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Addon;
use Illuminate\Database\Seeder;

class AddonSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'Handwritten Greeting Card',
                'description' => 'Add a personalized wax-sealed handwritten greeting card with your heartfelt message.',
                'price' => 350.00,
                'is_price_editable' => false,
                'type' => 'personalization',
                'icon' => '💌',
                'image' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Luxury Velvet Gift Box & Ribbon',
                'description' => 'Premium magnetic closing velvet gift box with hand-tied luxury satin ribbon.',
                'price' => 1250.00,
                'is_price_editable' => true,
                'type' => 'addon',
                'icon' => '🎁',
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Mini Cuddle Teddy Bear',
                'description' => 'Super-soft 15cm plush cuddly teddy bear with decorative ribbon.',
                'price' => 1500.00,
                'is_price_editable' => false,
                'type' => 'addon',
                'icon' => '🧸',
                'image' => 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Ferrero Rocher Box (8 Pcs)',
                'description' => 'Crisp hazelnut and milk chocolate pralines in elegant gold packaging.',
                'price' => 1850.00,
                'is_price_editable' => true,
                'type' => 'addon',
                'icon' => '🍫',
                'image' => 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&q=80',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Custom Acrylic Photo Plaque',
                'description' => 'High-definition custom photo printed with solid wood base.',
                'price' => 2200.00,
                'is_price_editable' => true,
                'type' => 'personalization',
                'icon' => '📸',
                'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'French Vanilla Scented Candle',
                'description' => 'Hand-poured natural soy wax candle with calming french vanilla bean notes.',
                'price' => 1400.00,
                'is_price_editable' => false,
                'type' => 'addon',
                'icon' => '🕯️',
                'image' => 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($items as $item) {
            Addon::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
