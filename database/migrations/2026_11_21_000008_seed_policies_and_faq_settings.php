<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $defaults = [
            'faq_items' => json_encode([
                [
                    'q' => 'Do you offer same-day delivery in Colombo and suburbs?',
                    'a' => 'Yes! We offer same-day delivery across Colombo 1-15 and immediate suburbs (Dehiwala, Nugegoda, Rajagiriya, Battaramulla, Mount Lavinia, etc.) for orders placed before 12:00 PM.'
                ],
                [
                    'q' => 'Can I choose a specific delivery date and time slot?',
                    'a' => 'Absolutely. During checkout, you can select your preferred delivery date (up to 30 days in advance) as well as a convenient time slot: Morning (10 AM - 1 PM), Afternoon (1 PM - 4 PM), or Evening (4 PM - 7 PM).'
                ],
                [
                    'q' => 'How does personalization work for mugs, frames, and greeting cards?',
                    'a' => 'When you select any personalized gift item, text input boxes appear directly on the product page where you can specify recipient names, custom quotes, or greeting card wishes. If your item requires a photo, our customer service team will reach out via WhatsApp immediately after order placement.'
                ],
                [
                    'q' => 'What payment methods do you accept?',
                    'a' => 'We accept Visa, MasterCard, and American Express online, local bank transfers, and Cash on Delivery (COD) for eligible gift items and delivery zones.'
                ],
                [
                    'q' => 'Are the flowers delivered fresh?',
                    'a' => 'Yes, 100%! All our floral bouquets and arrangements are freshly sourced on the day of delivery from local growers and arranged in temperature-controlled preparation rooms with water packs to preserve peak freshness.'
                ],
            ]),
            'faq_support_text' => 'Chat with our dedicated support team on WhatsApp for instant assistance.',
            'policy_delivery_highlights' => json_encode([
                [
                    'title' => 'Same Day Delivery',
                    'desc' => 'Available for Colombo 1-15 & Greater Colombo for orders placed before 12:00 PM noon.'
                ],
                [
                    'title' => 'Islandwide Delivery',
                    'desc' => 'Delivered within 1 to 2 working days via our reliable courier partners with live tracking.'
                ]
            ]),
            'policy_delivery' => json_encode([
                [
                    'title' => '1. Delivery Charges',
                    'content' => 'Standard delivery charge across the island is LKR 350. Orders exceeding LKR 5,000 qualify for 100% Free Delivery. Same-day express priority delivery is available for LKR 750.'
                ],
                [
                    'title' => '2. Cake & Perishable Handling',
                    'content' => 'Cakes and fresh floral bouquets are transported in dedicated refrigerated containers to preserve temperature and structural integrity during transit.'
                ],
                [
                    'title' => '3. Recipient Contact & Surprise Policy',
                    'content' => 'If you prefer a complete surprise delivery, you can mention it during checkout. Our delivery rider will only contact the recipient upon arrival at the gate.'
                ]
            ]),
            'policy_privacy' => json_encode([
                [
                    'title' => '1. Information We Collect',
                    'content' => 'We collect your contact details (name, email, phone number) and recipient details (name, address, delivery instructions) solely for executing the order delivery and communication.'
                ],
                [
                    'title' => '2. Payment Security',
                    'content' => 'We do not store credit or debit card numbers on our servers. All online transactions are processed through bank-grade encrypted payment gateways with 3D Secure verification.'
                ],
                [
                    'title' => '3. Confidentiality of Gift Messages',
                    'content' => 'Personal greeting card messages and custom photos shared for customization are strictly confidential and deleted after order completion.'
                ]
            ]),
            'policy_terms' => json_encode([
                [
                    'title' => '1. Agreement to Terms',
                    'content' => 'By accessing or purchasing from Wishes.com, you agree to be bound by these Terms and our Delivery & Refund Policies.'
                ],
                [
                    'title' => '2. Product Availability & Substitution',
                    'content' => 'Due to seasonal flower blooms and artisan handcrafted items, minor variations in shade or basket styles may occur. We guarantee any substitution will always be of equal or greater value and beauty.'
                ],
                [
                    'title' => '3. Pricing & Currency',
                    'content' => 'All prices listed on Wishes.com are in Sri Lankan Rupees (LKR) and include applicable packaging taxes.'
                ]
            ]),
            'policy_returns' => json_encode([
                [
                    'title' => '1. Freshness & Quality Guarantee',
                    'content' => 'If any fresh flowers or perishable items arrive damaged or sub-standard, please notify us within 24 hours of delivery along with a photo. We will immediately dispatch a fresh replacement or issue a full refund with no hassle.'
                ],
                [
                    'title' => '2. Personalized Items',
                    'content' => 'Custom-printed mugs, engraved acrylic frames, and personalized greeting cards cannot be returned unless there was an error in printing on our side, in which case we will reprint and deliver at zero additional cost.'
                ],
                [
                    'title' => '3. Refund Processing',
                    'content' => 'Approved refunds are credited back to the original payment method (Credit/Debit Card or Bank Transfer) within 3-5 business days.'
                ]
            ]),
        ];

        foreach ($defaults as $key => $val) {
            DB::table('settings')->updateOrInsert(
                ['key' => $key],
                ['value' => $val, 'group' => 'policies', 'updated_at' => now(), 'created_at' => now()]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'faq_items', 'faq_support_text', 'policy_delivery_highlights',
            'policy_delivery', 'policy_privacy', 'policy_terms', 'policy_returns'
        ])->delete();
    }
};
