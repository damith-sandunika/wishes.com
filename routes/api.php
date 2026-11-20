<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\OccasionController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/orders', [AuthController::class, 'orders']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin API Routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::apiResource('/categories', CategoryController::class);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/orders', OrderController::class)->except(['store']);
    Route::apiResource('/coupons', \App\Http\Controllers\Api\CouponController::class)->except(['show', 'update']);
    Route::apiResource('/sliders', SliderController::class);
    Route::apiResource('/occasions', OccasionController::class);
    Route::apiResource('/reviews', ReviewController::class)->only(['index', 'destroy']);
    Route::patch('/reviews/{review}/toggle-approve', [ReviewController::class, 'toggleApprove']);
    
    // Settings, Suppliers, Stock Logs, Reports
    Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
    Route::post('/settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);
    Route::apiResource('/suppliers', \App\Http\Controllers\Api\SupplierController::class);
    Route::apiResource('/stock-logs', \App\Http\Controllers\Api\StockLogController::class)->only(['index', 'store']);
    Route::get('/reports/sales', [\App\Http\Controllers\Api\ReportController::class, 'sales']);
    Route::get('/reports/orders', [\App\Http\Controllers\Api\ReportController::class, 'orders']);
    Route::get('/reports/stock', [\App\Http\Controllers\Api\ReportController::class, 'stock']);

    // WhatsApp Proxy Routes
    Route::get('/whatsapp/status', function () {
        try {
            return \Illuminate\Support\Facades\Http::get('http://127.0.0.1:3006/status')->json();
        } catch (\Exception $e) {
            return response()->json(['status' => 'DISCONNECTED'], 500);
        }
    });

    Route::post('/whatsapp/logout', function () {
        try {
            return \Illuminate\Support\Facades\Http::post('http://127.0.0.1:3006/logout')->json();
        } catch (\Exception $e) {
            return response()->json(['status' => 'ERROR'], 500);
        }
    });
});

// Public API Routes (for customer frontend)
Route::get('/public/settings', [\App\Http\Controllers\Api\SettingController::class, 'publicIndex']);
Route::post('/public/orders', [OrderController::class, 'store'])->middleware('throttle:20,1');
Route::get('/public/categories', [CategoryController::class, 'index']);
Route::get('/public/occasions', [OccasionController::class, 'publicIndex']);
Route::get('/public/products', [ProductController::class, 'index']);
Route::get('/public/products/{product}', [ProductController::class, 'show']);
Route::post('/public/products/{product}/reviews', [ProductController::class, 'addReview']);
Route::get('/public/reviews', [ReviewController::class, 'publicReviews']);
Route::post('/public/coupons/validate', [\App\Http\Controllers\Api\CouponController::class, 'validateCoupon'])->middleware('throttle:30,1');
Route::get('/public/sliders', [SliderController::class, 'publicIndex']);
