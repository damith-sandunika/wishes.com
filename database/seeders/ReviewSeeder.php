<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $sampleReviews = [
            [
                'author_name' => 'Nethmi Perera',
                'rating' => 5,
                'title' => 'Fresh and wonderfully arranged flowers',
                'content' => 'The red roses were exceptionally fresh and blooming! The wrapping paper and ribbon looked so luxurious. Delivered right on time in Colombo 07. Thank you Wishes.com!',
            ],
            [
                'author_name' => 'Kasun Wickramasinghe',
                'rating' => 5,
                'title' => 'The personalized gift was unforgettable',
                'content' => 'Ordered this for my wife’s birthday surprise. The custom engraved name and our printed photo frame were flawless. The chocolate box inside tasted heavenly.',
            ],
            [
                'author_name' => 'Dinithi Fernando',
                'rating' => 5,
                'title' => 'Rich, moist and delicious chocolate cake',
                'content' => 'The cake arrived in pristine condition, chilled and perfectly decorated with the birthday plaque. Everyone in the party loved every single bite!',
            ],
            [
                'author_name' => 'Malith Jayawardena',
                'rating' => 4,
                'title' => 'High quality packaging & fast delivery',
                'content' => 'Superb gift experience. Very neat wrapping with great attention to detail. Same-day delivery service worked smoothly even on a rainy evening.',
            ],
            [
                'author_name' => 'Chathurika Maduwanthi',
                'rating' => 5,
                'title' => 'Best flower & gift shop in Sri Lanka',
                'content' => 'I regularly order gifts from Wishes.com for family events. Never disappointed! Beautiful arrangement and responsive WhatsApp customer care.',
            ],
            [
                'author_name' => 'Sanjaya Bandara',
                'rating' => 5,
                'title' => 'Exceeded all expectations',
                'content' => 'The gift hamper was packed with top-shelf goodies. My fiancée was amazed by how cute the teddy bear was and how fresh the arrangement looked.',
            ],
        ];

        $products = Product::all();
        if ($products->isEmpty()) return;

        foreach ($products as $index => $product) {
            $revData = $sampleReviews[$index % count($sampleReviews)];
            Review::firstOrCreate(
                [
                    'product_id' => $product->id,
                    'author_name' => $revData['author_name'],
                ],
                [
                    'rating' => $revData['rating'],
                    'title' => $revData['title'],
                    'content' => $revData['content'],
                    'is_approved' => true,
                ]
            );

            // Add second review for top products
            if ($index < 4) {
                $revData2 = $sampleReviews[($index + 3) % count($sampleReviews)];
                Review::firstOrCreate(
                    [
                        'product_id' => $product->id,
                        'author_name' => $revData2['author_name'] . ' (Verified)',
                    ],
                    [
                        'rating' => 5,
                        'title' => 'Wonderful quality & presentation',
                        'content' => 'Gifting made so effortless. Premium touch all the way through.',
                        'is_approved' => true,
                    ]
                );
            }
        }
    }
}
