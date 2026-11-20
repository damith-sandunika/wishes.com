<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Occasion;
use App\Models\Product;

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
                'image' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-pink-500 to-rose-600',
                'sort_order' => 1,
            ],
            [
                'title' => 'Anniversaries & Romance',
                'slug' => 'anniversary',
                'description' => 'Red roses, luxury hampers & personalized keepsakes to celebrate love.',
                'icon' => 'Heart',
                'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-rose-600 to-red-700',
                'sort_order' => 2,
            ],
            [
                'title' => 'Personalized Keepsakes',
                'slug' => 'personalized',
                'description' => 'Custom engraved acrylic photo frames, custom mugs & custom greeting cards.',
                'icon' => 'Sparkles',
                'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-purple-600 to-indigo-700',
                'sort_order' => 3,
            ],
            [
                'title' => 'Congratulations & Achievements',
                'slug' => 'congratulations',
                'description' => 'Celebrate promotions, graduations, and major milestones in style.',
                'icon' => 'Trophy',
                'image' => 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-amber-500 to-orange-600',
                'sort_order' => 4,
            ],
            [
                'title' => 'Corporate & Client Gifts',
                'slug' => 'corporate',
                'description' => 'Professional premium executive gift boxes for partners and team members.',
                'icon' => 'Briefcase',
                'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-slate-700 to-gray-900',
                'sort_order' => 5,
            ],
            [
                'title' => 'Get Well & Cheer Up',
                'slug' => 'get-well',
                'description' => 'Fresh fruit hampers, floral cheer and uplifting thoughtful gift baskets.',
                'icon' => 'Smile',
                'image' => 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
                'bg_gradient' => 'from-teal-500 to-emerald-600',
                'sort_order' => 6,
            ],
        ];

        foreach ($occasions as $occ) {
            Occasion::updateOrCreate(['slug' => $occ['slug']], $occ);
        }

        // Tag products with occasions
        $products = Product::all();
        foreach ($products as $p) {
            $name = strtolower($p->name);
            $tags = ['birthday'];
            if (str_contains($name, 'rose') || str_contains($name, 'flower') || str_contains($name, 'velvet')) {
                $tags[] = 'anniversary';
            }
            if (str_contains($name, 'personalized') || $p->enable_personalization) {
                $tags[] = 'personalized';
            }
            if (str_contains($name, 'hamper') || str_contains($name, 'box') || str_contains($name, 'chocolate')) {
                $tags[] = 'congratulations';
                $tags[] = 'corporate';
            }
            if (str_contains($name, 'sunflower') || str_contains($name, 'bouquet')) {
                $tags[] = 'get-well';
            }
            $p->update(['occasions' => array_values(array_unique($tags))]);
        }
    }
}
