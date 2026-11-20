<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@wishes.com'],
            [
                'name' => 'Wishes Admin',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Settings
        $settings = [
            'shop_name' => 'Wishes.com',
            'shop_email' => 'support@wishes.com',
            'shop_phone' => '+94 71 808 0582',
            'shop_address' => 'Colombo, Sri Lanka',
            'shop_currency' => 'LKR',
            'delivery_charge' => '350',
            'free_delivery_above' => '5000',
            'bank_name' => 'Commercial Bank',
            'bank_branch' => 'Colombo',
            'bank_account_name' => 'Wishes.com Pvt Ltd',
            'bank_account_number' => '800123456789',
            'whatsapp_number' => '+94718080582',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(['key' => $key], ['value' => $val, 'group' => 'general']);
        }

        // 3. Categories
        $categoriesData = [
            ['name' => 'Flowers', 'slug' => 'flowers', 'description' => 'Fresh flower bouquets and floral arrangements'],
            ['name' => 'Cakes', 'slug' => 'cakes', 'description' => 'Delectable celebration cakes and pastries'],
            ['name' => 'Chocolates', 'slug' => 'chocolates', 'description' => 'Luxury artisan chocolates and gift packs'],
            ['name' => 'Gift Hampers', 'slug' => 'hampers', 'description' => 'Curated premium hampers for all celebrations'],
            ['name' => 'Teddy Bears', 'slug' => 'teddy-bears', 'description' => 'Soft cuddly teddy bears and plush toys'],
            ['name' => 'Apparel Gifts', 'slug' => 'apparel', 'description' => 'Curated clothing and wearable gift items'],
            ['name' => 'Personalized Gifts', 'slug' => 'personalized', 'description' => 'Customized mugs, frames and keepsake gifts'],
            ['name' => 'Corporate Gifts', 'slug' => 'corporate', 'description' => 'Professional gifting sets for partners and teams'],
        ];

        $cats = [];
        foreach ($categoriesData as $c) {
            $cats[$c['slug']] = Category::updateOrCreate(['slug' => $c['slug']], $c);
        }

        // 4. Products (Matching Design Screenshots)
        $products = [
            [
                'category_id' => $cats['flowers']->id,
                'name' => 'Red Rose Bouquet',
                'selling_price' => 6500,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => '12 fresh red roses elegantly wrapped with signature ribbon.',
                'description' => 'Premium romantic red roses hand-picked at sunrise, arranged with baby breath and wrapped in luxurious craft paper.',
                'unit_type' => 'bouquet',
                'current_stock' => 50,
            ],
            [
                'category_id' => $cats['chocolates']->id,
                'name' => 'Premium Chocolate Box',
                'selling_price' => 5500,
                'discount_price' => 4950,
                'images' => [
                    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Artisan assorted pralines and Ferrero Rocher box.',
                'description' => 'An exquisite collection of handcrafted dark, milk, and white chocolate truffles presented in a gold ribbon gift box.',
                'unit_type' => 'box',
                'current_stock' => 100,
            ],
            [
                'category_id' => $cats['cakes']->id,
                'name' => 'Chocolate Birthday Cake',
                'selling_price' => 7900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Rich Belgian chocolate sponge with chocolate ganache.',
                'description' => 'Decadent multi-layered chocolate cake with smooth chocolate cream frosting, strawberries and chocolate curls.',
                'unit_type' => '1kg',
                'current_stock' => 20,
            ],
            [
                'category_id' => $cats['teddy-bears']->id,
                'name' => 'Love Teddy Bear (Large)',
                'selling_price' => 5900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Ultra-soft 18-inch cuddly teddy bear with I Love You heart.',
                'description' => 'Made with hypoallergenic soft plush fabric, this adorable giant teddy bear is the warmest gift for your loved one.',
                'unit_type' => 'piece',
                'current_stock' => 30,
            ],
            [
                'category_id' => $cats['hampers']->id,
                'name' => 'Premium Gift Hamper',
                'selling_price' => 14900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Luxury basket packed with chocolates, cookies, and non-alcoholic sparkling cider.',
                'description' => 'Deluxe celebratory hamper featuring imported gourmet treats, artisan snacks, cookies, and celebration drinks in an authentic wicker basket.',
                'unit_type' => 'hamper',
                'current_stock' => 15,
            ],
            [
                'category_id' => $cats['flowers']->id,
                'name' => 'Lily Flower Bouquet',
                'selling_price' => 6900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Fragrant pink oriental lilies wrapped in pastel blush paper.',
                'description' => 'Breathtaking fresh pink lilies that blossom over several days, spreading elegance and sweet fragrance.',
                'unit_type' => 'bouquet',
                'current_stock' => 40,
            ],
            [
                'category_id' => $cats['personalized']->id,
                'name' => 'Personalized LED Photo Frame',
                'selling_price' => 8500,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Custom engraved acrylic photo frame with warm LED base.',
                'description' => 'Send us your favorite photo and custom quote to be laser engraved on premium crystal acrylic with a solid wooden LED light base.',
                'unit_type' => 'piece',
                'current_stock' => 50,
            ],
            [
                'category_id' => $cats['hampers']->id,
                'name' => 'Anniversary Gift Box',
                'selling_price' => 9900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Curated anniversary package with heart chocolates, scented candle & card.',
                'description' => 'A romantic gift box created especially for anniversaries with custom message, imported treats, and celebratory items.',
                'unit_type' => 'box',
                'current_stock' => 25,
            ],
            [
                'category_id' => $cats['personalized']->id,
                'name' => 'Custom Photo Mug',
                'selling_price' => 2250,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Glossy ceramic mug with high definition custom photo print.',
                'description' => 'Microwave and dishwasher safe ceramic mug personalized with high quality print of your cherished memories.',
                'unit_type' => 'piece',
                'current_stock' => 100,
            ],
            [
                'category_id' => $cats['hampers']->id,
                'name' => 'Birthday Surprise Box',
                'selling_price' => 11500,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Mini teddy, Ferrero chocolates, birthday mug & treats in pink box.',
                'description' => 'Everything you need to send a magical birthday surprise straight to their hands with gift wrap and personalized greeting card.',
                'unit_type' => 'box',
                'current_stock' => 30,
            ],
            [
                'category_id' => $cats['flowers']->id,
                'name' => 'Mixed Flower Basket',
                'selling_price' => 8900,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Sunflowers, pink roses, carnations and fresh greens in rustic basket.',
                'description' => 'A vibrant, cheerful bouquet of fresh seasonal flowers in a decorative wicker basket with floral foam for lasting beauty.',
                'unit_type' => 'basket',
                'current_stock' => 25,
            ],
            [
                'category_id' => $cats['cakes']->id,
                'name' => 'Red Velvet Cake',
                'selling_price' => 7500,
                'discount_price' => null,
                'images' => [
                    'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Silky smooth red velvet cake with creamy cream cheese frosting.',
                'description' => 'Classic Southern red velvet sponge layered with authentic Philadelphia cream cheese frosting and crimson crumbs.',
                'unit_type' => '1kg',
                'current_stock' => 15,
            ],
            [
                'category_id' => $cats['hampers']->id,
                'name' => 'Personalized Birthday Gift Box',
                'selling_price' => 9250,
                'discount_price' => 7950,
                'images' => [
                    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
                ],
                'short_description' => 'Custom mug, soft teddy, Ferrero chocolates and bouquet in lavender box.',
                'description' => 'Make their birthday extra special with a personalized gift box featuring a custom mug, soft teddy, premium chocolates, and a beautiful flower bouquet.',
                'unit_type' => 'box',
                'current_stock' => 45,
            ],
        ];

        foreach ($products as $p) {
            $p['slug'] = Str::slug($p['name']);
            Product::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // 5. Coupons
        Coupon::updateOrCreate(
            ['code' => 'WELCOME10'],
            [
                'discount_percent' => 10,
                'max_discount' => 1000,
                'is_active' => true,
                'valid_until' => now()->addMonths(6),
            ]
        );

        Coupon::updateOrCreate(
            ['code' => 'WISHES20'],
            [
                'discount_percent' => 20,
                'max_discount' => 2000,
                'is_active' => true,
                'valid_until' => now()->addMonths(6),
            ]
        );
    }
}
