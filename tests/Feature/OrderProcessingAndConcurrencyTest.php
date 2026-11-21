<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use App\Models\Setting;
use App\Models\StockLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class OrderProcessingAndConcurrencyTest extends TestCase
{
    use RefreshDatabase;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();

        $this->category = Category::firstOrCreate(
            ['slug' => 'test-gifts'],
            ['name' => 'Test Gifts', 'description' => 'Test', 'status' => true, 'sort_order' => 1]
        );

        Setting::updateOrCreate(['key' => 'delivery_charge'], ['value' => '350']);
        Setting::updateOrCreate(['key' => 'free_delivery_above'], ['value' => '5000']);
    }

    public function test_order_creation_successfully_decrements_stock_and_creates_audit_log(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'name' => 'Luxury Red Rose Bouquet',
            'slug' => 'luxury-red-rose-bouquet-' . uniqid(),
            'selling_price' => 2500,
            'current_stock' => 10,
            'status' => true,
        ]);

        $payload = [
            'customer_name' => 'John Doe',
            'whatsapp_number' => '0771234567',
            'delivery_address' => '77 Galle Road, Colombo',
            'payment_method' => 'Cash On Delivery',
            'items' => [
                [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => 2,
                ],
            ],
        ];

        $response = $this->postJson('/api/public/orders', $payload);

        $response->assertStatus(201);
        $orderData = $response->json();
        $this->assertNotEmpty($orderData['tracking_number']);
        $this->assertNotEmpty($orderData['invoice_number']);

        // Assert stock decremented from 10 to 8
        $this->assertEquals(8, $product->fresh()->current_stock);

        // Assert StockLog was created
        $stockLog = StockLog::where('product_id', $product->id)->where('type', 'sale')->first();
        $this->assertNotNull($stockLog);
        $this->assertEquals(-2, $stockLog->quantity);

        // Assert OrderStatusHistory initial record
        $history = OrderStatusHistory::where('order_id', $orderData['id'])->first();
        $this->assertNotNull($history);
        $this->assertEquals('Pending', $history->to_status);
    }

    public function test_order_creation_fails_when_stock_is_insufficient(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'name' => 'Limited Edition Watch',
            'slug' => 'limited-edition-watch-' . uniqid(),
            'selling_price' => 15000,
            'current_stock' => 1,
            'status' => true,
        ]);

        $payload = [
            'customer_name' => 'Jane Doe',
            'whatsapp_number' => '0779998888',
            'delivery_address' => '12 Kandy Road',
            'payment_method' => 'Cash On Delivery',
            'items' => [
                [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => 3, // Demands 3, only 1 available!
                ],
            ],
        ];

        $response = $this->postJson('/api/public/orders', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['items']);

        // Stock must remain intact
        $this->assertEquals(1, $product->fresh()->current_stock);
    }

    public function test_delivery_charge_is_calculated_server_side_preventing_tampering(): void
    {
        $product = Product::create([
            'category_id' => $this->category->id,
            'name' => 'Standard Chocolates Box',
            'slug' => 'standard-chocolates-box-' . uniqid(),
            'selling_price' => 2000, // Under 5000 threshold
            'current_stock' => 20,
            'status' => true,
        ]);

        $payload = [
            'customer_name' => 'Sneaky Buyer',
            'whatsapp_number' => '0773332211',
            'delivery_address' => '10 Marine Drive',
            'payment_method' => 'Cash On Delivery',
            'delivery_method' => 'standard',
            'delivery_charge' => 0.00, // Attempting to force 0 delivery charge!
            'items' => [
                [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => 1,
                ],
            ],
        ];

        $response = $this->postJson('/api/public/orders', $payload);

        $response->assertStatus(201);
        $order = $response->json();

        // Must enforce 350 standard delivery charge, grand_total = 2350
        $this->assertEquals(350.0, (float)$order['delivery_charge']);
        $this->assertEquals(2350.0, (float)$order['grand_total']);
    }

    public function test_admin_status_transition_records_audit_history(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $order = Order::create([
            'tracking_number' => 'WSH-TRK-AUDIT01',
            'invoice_number' => 'WSH-INV-AUDIT01',
            'customer_name' => 'Audit Tester',
            'whatsapp_number' => '0712345678',
            'delivery_address' => '50 Galle Road',
            'sub_total' => 3000,
            'grand_total' => 3350,
            'delivery_status' => 'Pending',
            'payment_status' => 'Pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->putJson("/api/orders/{$order->id}", [
            'delivery_status' => 'Confirmed',
            'payment_status' => 'Paid',
        ]);

        $response->assertStatus(200);

        // Check history
        $history = OrderStatusHistory::where('order_id', $order->id)
            ->where('to_status', 'Confirmed')
            ->first();

        $this->assertNotNull($history);
        $this->assertEquals('Pending', $history->from_status);
        $this->assertEquals($admin->id, $history->user_id);
    }
}
