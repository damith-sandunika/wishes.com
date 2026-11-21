<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function health()
    {
        $dbOk = false;
        try {
            DB::connection()->getPdo();
            $dbOk = true;
        } catch (\Exception $e) {}

        return response()->json([
            'status' => $dbOk ? 'healthy' : 'unhealthy',
            'database' => $dbOk ? 'connected' : 'disconnected',
            'timestamp' => now()->toIso8601String(),
        ], $dbOk ? 200 : 503);
    }

    public function index()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $todaysSales = (float)Order::whereDate('created_at', $today)->where('payment_status', 'Paid')->sum('grand_total');
        $monthlySales = (float)Order::whereBetween('created_at', [$startOfMonth, Carbon::now()])->where('payment_status', 'Paid')->sum('grand_total');
        
        $totalOrders = Order::count();
        $pendingOrders = Order::where('delivery_status', 'Pending')->count();
        $deliveredOrders = Order::where('delivery_status', 'Delivered')->count();
        
        $totalProducts = Product::count();
        $lowStockAlerts = Product::whereColumn('current_stock', '<=', 'low_stock_limit')->count();

        $latestOrders = Order::with('items')->latest()->take(5)->get();

        // Chart data for last 6 months using index-friendly date boundaries
        $chartData = collect(range(5, 0))->map(function($i) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = (clone $monthStart)->endOfMonth();

            $gross = (float)Order::whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('payment_status', 'Paid')
                ->sum('grand_total');
                
            $net = $gross * 0.7; // Estimated net margin

            return [
                'name' => $monthStart->format('M Y'),
                'gross' => round($gross, 2),
                'net' => round($net, 2),
            ];
        })->values();

        $totalRevenue = (float)Order::where('payment_status', 'Paid')->sum('grand_total');
        $totalCustomers = User::where('role', 'customer')->count();

        return response()->json([
            'todaysSales' => round($todaysSales, 2),
            'monthlySales' => round($monthlySales, 2),
            'totalRevenue' => round($totalRevenue, 2),
            'totalOrders' => $totalOrders,
            'totalCustomers' => $totalCustomers,
            'pendingOrders' => $pendingOrders,
            'deliveredOrders' => $deliveredOrders,
            'totalProducts' => $totalProducts,
            'lowStock' => $lowStockAlerts,
            'latestOrders' => $latestOrders,
            'chartData' => $chartData,
        ]);
    }

    public function customers(Request $request)
    {
        $search = $request->query('search');
        $query = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'grand_total')
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }
}
