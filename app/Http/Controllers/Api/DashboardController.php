<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $todaysSales = Order::whereDate('created_at', $today)->where('payment_status', 'Paid')->sum('grand_total');
        $monthlySales = Order::whereBetween('created_at', [$startOfMonth, Carbon::now()])->where('payment_status', 'Paid')->sum('grand_total');
        
        $totalOrders = Order::count();
        $pendingOrders = Order::where('delivery_status', 'Pending')->count();
        $deliveredOrders = Order::where('delivery_status', 'Delivered')->count();
        
        $totalProducts = Product::count();
        $lowStockAlerts = Product::whereColumn('current_stock', '<=', 'low_stock_limit')->count();

        // Best selling logic (grouped by product_id in order_items)
        // For simplicity, just get recent orders here.
        $latestOrders = Order::with('items')->latest()->take(5)->get();

        // Generate chart data for the last 6 months
        $chartData = collect(range(5, 0))->map(function($i) {
            $date = Carbon::now()->startOfMonth()->subMonths($i);
            $gross = Order::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->where('payment_status', 'Paid')
                ->sum('grand_total');
                
            $net = $gross * 0.7; // Estimated net profit

            return [
                'name' => $date->format('M Y'),
                'gross' => $gross,
                'net' => $net
            ];
        })->values();

        // Calculate total revenue (all time paid orders)
        $totalRevenue = Order::where('payment_status', 'Paid')->sum('grand_total');
        
        // Total customers (unique user_id from orders or users table, let's use unique users who ordered for now, or just users table)
        $totalCustomers = \App\Models\User::where('role', '!=', 'admin')->count();

        return response()->json([
            'todaysSales' => $todaysSales,
            'monthlySales' => $monthlySales,
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'pendingOrders' => $pendingOrders,
            'deliveredOrders' => $deliveredOrders,
            'totalProducts' => $totalProducts,
            'lowStock' => $lowStockAlerts,
            'latestOrders' => $latestOrders,
            'chartData' => $chartData
        ]);
    }
}
