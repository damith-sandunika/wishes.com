<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CatalogAndCouponsTest extends TestCase
{
    use RefreshDatabase;

    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = Category::firstOrCreate(
            ['slug' => 'chocolates-cakes'],
            [
                'name' => 'Chocolates & Cakes',
                'status' => true,
                'sort_order' => 1,
            ]
        );
    }

    public function test_coupon_validation_with_percentage_and_max_discount_cap(): void
    {
        // 20% discount up to max 1000 LKR
        $coupon = Coupon::create([
            'code' => 'VALENTINE20',
            'discount_percent' => 20,
            'max_discount' => 1000,
            'is_active' => true,
            'valid_until' => now()->addDays(10),
        ]);

        // Case 1: Subtotal 3000 -> 20% is 600 (under 1000 max)
        $response1 = $this->postJson('/api/public/coupons/validate', [
            'code' => 'VALENTINE20',
            'sub_total' => 3000,
        ]);
        $response1->assertStatus(200);

        // Case 2: Subtotal 10000 -> 20% is 2000, capped at 1000
        $response2 = $this->postJson('/api/public/coupons/validate', [
            'code' => 'VALENTINE20',
            'sub_total' => 10000,
        ]);
        $response2->assertStatus(200);

        // Case 3: Inactive coupon
        $inactive = Coupon::create([
            'code' => 'INACTIVE10',
            'discount_percent' => 10,
            'is_active' => false,
        ]);
        $responseInactive = $this->postJson('/api/public/coupons/validate', ['code' => 'INACTIVE10']);
        $responseInactive->assertStatus(400);

        // Case 4: Expired coupon
        $expired = Coupon::create([
            'code' => 'EXPIRED50',
            'discount_percent' => 50,
            'is_active' => true,
            'valid_until' => now()->subDay(),
        ]);
        $responseExpired = $this->postJson('/api/public/coupons/validate', ['code' => 'EXPIRED50']);
        $responseExpired->assertStatus(400);
    }

    public function test_public_product_catalog_filters_only_active_products_and_supports_pagination(): void
    {
        Product::create([
            'category_id' => $this->category->id,
            'name' => 'Active Bouquet 1',
            'slug' => 'active-bouquet-1',
            'selling_price' => 3000,
            'status' => true,
        ]);

        Product::create([
            'category_id' => $this->category->id,
            'name' => 'Active Bouquet 2',
            'slug' => 'active-bouquet-2',
            'selling_price' => 5000,
            'status' => true,
        ]);

        Product::create([
            'category_id' => $this->category->id,
            'name' => 'Hidden Draft Bouquet',
            'slug' => 'hidden-draft-bouquet',
            'selling_price' => 2000,
            'status' => false, // Inactive / Draft
        ]);

        // Public customer view should only receive active products
        $response = $this->getJson('/api/public/products');
        $response->assertStatus(200);
        $products = $response->json();

        $names = array_column($products, 'name');
        $this->assertContains('Active Bouquet 1', $names);
        $this->assertContains('Active Bouquet 2', $names);
        $this->assertNotContains('Hidden Draft Bouquet', $names);

        // Test explicit pagination
        $pagedResponse = $this->getJson('/api/public/products?page=1&per_page=1');
        $pagedResponse->assertStatus(200);
        $pagedData = $pagedResponse->json();
        $this->assertArrayHasKey('current_page', $pagedData);
        $this->assertCount(1, $pagedData['data']);
    }

    public function test_customer_cannot_download_payment_slip_without_admin_privileges(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('bank_slip.jpg', 500, 'image/jpeg');
        $path = $file->store('slips', 'public');

        $order = Order::create([
            'tracking_number' => 'WSH-TRK-SLIP01',
            'invoice_number' => 'WSH-INV-SLIP01',
            'customer_name' => 'Slip Customer',
            'whatsapp_number' => '0711122334',
            'delivery_address' => 'Colombo',
            'payment_slip' => $path,
            'delivery_status' => 'Pending',
        ]);

        $customer = User::factory()->create(['role' => 'customer']);
        $admin = User::factory()->create(['role' => 'admin']);

        // Non-admin customer forbidden
        $forbiddenResponse = $this->actingAs($customer, 'sanctum')->getJson("/api/orders/{$order->id}/slip");
        $forbiddenResponse->assertStatus(403);

        // Admin allowed
        $adminResponse = $this->actingAs($admin, 'sanctum')->get("/api/orders/{$order->id}/slip");
        $adminResponse->assertStatus(200);
    }

    public function test_product_review_sanitizes_html_tags(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'name' => 'Review Test Product',
            'slug' => 'review-test-product',
            'selling_price' => 1500,
            'status' => true,
        ]);

        $response = $this->postJson("/api/public/products/{$product->id}/reviews", [
            'author_name' => '<b>Bold Customer</b>',
            'rating' => 5,
            'title' => '<i>Amazing!</i>',
            'content' => '<script>alert("xss")</script>Loved this flower arrangement so much!',
        ]);

        $response->assertStatus(201);
        $review = Review::where('product_id', $product->id)->first();
        $this->assertNotNull($review);
        $this->assertEquals('Bold Customer', $review->author_name);
        $this->assertEquals('Amazing!', $review->title);
        $this->assertStringNotContainsString('<script>', $review->content);
        $this->assertStringContainsString('Loved this flower arrangement so much!', $review->content);
    }
}
