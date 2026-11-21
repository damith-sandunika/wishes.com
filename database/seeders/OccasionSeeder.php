<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Occasion;
use Illuminate\Database\Seeder;

class OccasionSeeder extends Seeder
{
    public function run(): void
    {
        $occasions = [
            [
                'title' => 'Birthday Celebrations',
                'slug' => 'birthday',
                'description' => 'Cakes, chocolates, plush teddies & custom gifts for their special day.',
                'icon' => 'Cake',
                'image' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-amber-500 to-rose-500',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Anniversaries & Romance',
                'slug' => 'anniversary',
                'description' => 'Red roses, luxury hampers & personalized keepsakes to celebrate love.',
                'icon' => 'Heart',
                'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-rose-500 to-red-600',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Personalized Keepsakes',
                'slug' => 'personalized',
                'description' => 'Custom engraved acrylic photo frames, custom mugs & greeting cards.',
                'icon' => 'Sparkles',
                'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-purple-500 to-pink-500',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Congratulations & Wins',
                'slug' => 'congratulations',
                'description' => 'Celebrate promotions, graduations, and major milestones in style.',
                'icon' => 'Trophy',
                'image' => 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-yellow-500 to-amber-600',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Corporate & Client Gifts',
                'slug' => 'corporate',
                'description' => 'Professional premium executive gift boxes for partners and teams.',
                'icon' => 'Briefcase',
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-slate-700 to-zinc-900',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'Get Well & Cheer Up',
                'slug' => 'get-well',
                'description' => 'Fresh fruit hampers, floral cheer and uplifting thoughtful gift baskets.',
                'icon' => 'Smile',
                'image' => 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                'bg_gradient' => 'from-emerald-500 to-teal-600',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($occasions as $data) {
            Occasion::updateOrCreate(['slug' => $data['slug']], $data);
        }
    }
}
