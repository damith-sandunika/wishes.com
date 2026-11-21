<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\OccasionController;
use App\Http\Controllers\Api\AddonController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\StockLogController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StaffController;

// Public Health Check
Route::get('/health', [DashboardController::class, 'health']);

// Authentication Endpoints
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');

// Read-only catalog endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::delete('/user/account', [AuthController::class, 'deactivate']);
    Route::get('/user/orders', [AuthController::class, 'orders']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin & Staff Routes (Guarded by EnsureUserIsAdmin)
    Route::middleware('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/customers', [DashboardController::class, 'customers']);
        Route::apiResource('/categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('/products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('/orders', OrderController::class)->except(['store']);
        Route::get('/orders/{order}/slip', [OrderController::class, 'downloadSlip']);
        Route::apiResource('/coupons', CouponController::class)->except(['show', 'update']);
        Route::apiResource('/sliders', SliderController::class)->except(['index', 'show']);
        Route::apiResource('/occasions', OccasionController::class)->except(['index', 'show']);
        Route::apiResource('/addons', AddonController::class)->except(['index', 'show']);
        Route::apiResource('/reviews', ReviewController::class)->only(['index', 'destroy']);
        Route::patch('/reviews/{review}/toggle-approve', [ReviewController::class, 'toggleApprove']);
        Route::apiResource('/staff', StaffController::class);

        // Settings, Suppliers, Stock Logs, Reports
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'update']);
        Route::apiResource('/suppliers', SupplierController::class);
        Route::apiResource('/stock-logs', StockLogController::class)->only(['index', 'store']);
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/payments', [ReportController::class, 'payments']);
        Route::get('/reports/products', [ReportController::class, 'products']);
        Route::get('/reports/orders', [ReportController::class, 'orders']);
        Route::get('/reports/stock', [ReportController::class, 'stock']);

        // WhatsApp Proxy Routes
        Route::get('/whatsapp/status', function () {
            try {
                return \Illuminate\Support\Facades\Http::timeout(3)->get('http://127.0.0.1:3006/status')->json();
            } catch (\Exception $e) {
                return response()->json(['status' => 'DISCONNECTED'], 500);
            }
        });

        Route::post('/whatsapp/logout', function () {
            try {
                return \Illuminate\Support\Facades\Http::timeout(3)->post('http://127.0.0.1:3006/logout')->json();
            } catch (\Exception $e) {
                return response()->json(['status' => 'ERROR'], 500);
            }
        });
    });
});

// Public API Routes (for customer storefront)
Route::get('/public/settings', [SettingController::class, 'publicIndex']);
Route::post('/public/orders', [OrderController::class, 'store'])->middleware('throttle:30,1');
Route::get('/public/categories', [CategoryController::class, 'index']);
Route::get('/public/occasions', [OccasionController::class, 'publicIndex']);
Route::get('/public/addons', [AddonController::class, 'publicIndex']);
Route::get('/public/products', [ProductController::class, 'index']);
Route::get('/public/products/{product}', [ProductController::class, 'show']);
Route::post('/public/products/{product}/reviews', [ProductController::class, 'addReview'])->middleware('throttle:5,1');
Route::get('/public/reviews', [ReviewController::class, 'publicReviews']);
Route::post('/public/coupons/validate', [CouponController::class, 'validateCoupon'])->middleware('throttle:15,1');
Route::get('/public/coupons/active-banner', [CouponController::class, 'activeBanner']);
Route::get('/public/sliders', [SliderController::class, 'publicIndex']);

// Index fallbacks
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/occasions', [OccasionController::class, 'index']);
Route::get('/addons', [AddonController::class, 'index']);
Route::get('/sliders', [SliderController::class, 'index']);
