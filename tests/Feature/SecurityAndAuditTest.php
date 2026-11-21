<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SecurityAndAuditTest extends TestCase
{
    use RefreshDatabase;
    public function test_public_settings_endpoint_does_not_leak_sensitive_credentials(): void
    {
        Cache::flush();

        Setting::updateOrCreate(['key' => 'whatsapp_api_token'], ['value' => 'SUPER_SECRET_TOKEN_12345']);
        Setting::updateOrCreate(['key' => 'whatsapp_api_url'], ['value' => 'https://api.whatsapp-gateway.internal']);
        Setting::updateOrCreate(['key' => 'whatsapp_instance_id'], ['value' => 'instance_998877']);
        Setting::updateOrCreate(['key' => 'shop_name'], ['value' => 'Wishes.com']);
        Setting::updateOrCreate(['key' => 'delivery_charge'], ['value' => '350']);

        $response = $this->getJson('/api/public/settings');

        $response->assertStatus(200);
        $response->assertJsonFragment(['shop_name' => 'Wishes.com']);
        $response->assertJsonMissing(['whatsapp_api_token' => 'SUPER_SECRET_TOKEN_12345']);
        $response->assertJsonMissing(['whatsapp_api_url' => 'https://api.whatsapp-gateway.internal']);
        $response->assertJsonMissing(['whatsapp_instance_id' => 'instance_998877']);
    }

    public function test_customer_cannot_view_another_customers_orders(): void
    {
        $userA = User::factory()->create([
            'name' => 'Alice Customer',
            'email' => 'alice@example.com',
            'role' => 'customer',
        ]);

        $userB = User::factory()->create([
            'name' => 'Bob Customer',
            'email' => 'bob@example.com',
            'role' => 'customer',
        ]);

        $orderA = Order::create([
            'user_id' => $userA->id,
            'tracking_number' => 'WSH-TRK-ALICE01',
            'invoice_number' => 'WSH-INV-ALICE01',
            'customer_name' => 'Alice Customer',
            'whatsapp_number' => '0711111111',
            'delivery_address' => '123 Flower Road, Colombo',
            'grand_total' => 4500,
            'payment_status' => 'Pending',
            'delivery_status' => 'Pending',
        ]);

        $orderB = Order::create([
            'user_id' => $userB->id,
            'tracking_number' => 'WSH-TRK-BOB01',
            'invoice_number' => 'WSH-INV-BOB01',
            'customer_name' => 'Bob Customer',
            'whatsapp_number' => '0722222222',
            'delivery_address' => '456 Rose Lane, Kandy',
            'grand_total' => 8900,
            'payment_status' => 'Pending',
            'delivery_status' => 'Pending',
        ]);

        // When Alice fetches her orders
        $response = $this->actingAs($userA, 'sanctum')->getJson('/api/user/orders');

        $response->assertStatus(200);
        $response->assertJsonFragment(['invoice_number' => 'WSH-INV-ALICE01']);
        $response->assertJsonMissing(['invoice_number' => 'WSH-INV-BOB01']);
    }

    public function test_non_admin_cannot_access_admin_dashboard_or_admin_settings(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
        ]);

        // Customer attempts to access admin dashboard
        $response = $this->actingAs($customer, 'sanctum')->getJson('/api/dashboard');
        $response->assertStatus(403);

        // Customer attempts to change settings
        $responseSettings = $this->actingAs($customer, 'sanctum')->postJson('/api/settings', [
            'shop_name' => 'Hacked Shop',
        ]);
        $responseSettings->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/dashboard');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'todaysSales',
            'monthlySales',
            'totalRevenue',
            'totalOrders',
            'totalCustomers',
            'chartData',
        ]);
    }

    public function test_health_check_endpoint_returns_healthy(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'status' => 'healthy',
            'database' => 'connected',
        ]);
    }
}
