<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $period = $request->period ?? 'monthly'; // daily, weekly, monthly
        $year   = $request->year ?? now()->year;

        $monthly = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as total_orders, SUM(grand_total) as revenue')
            ->whereYear('created_at', $year)
            ->where('payment_status', 'Paid')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();

        $totalRevenue = Order::where('payment_status', 'Paid')->sum('grand_total');
        $totalOrders  = Order::count();
        $avgOrder     = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $topProducts = OrderItem::selectRaw('product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return response()->json([
            'monthly'      => $monthly,
            'totalRevenue' => $totalRevenue,
            'totalOrders'  => $totalOrders,
            'avgOrder'     => round($avgOrder, 2),
            'topProducts'  => $topProducts,
        ]);
    }

    public function orders(Request $request)
    {
        $from = $request->from ?? now()->startOfMonth()->toDateString();
        $to   = $request->to ?? now()->toDateString();

        $orders = Order::whereBetween(DB::raw('DATE(created_at)'), [$from, $to])
            ->selectRaw('delivery_status, COUNT(*) as count, SUM(grand_total) as total')
            ->groupBy('delivery_status')
            ->get();

        return response()->json($orders);
    }

    public function stock()
    {
        $lowStock = Product::whereColumn('current_stock', '<=', 'low_stock_limit')
            ->orWhere('current_stock', '<=', 5)
            ->with('category')
            ->get();

        $expiring = Product::whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->orderBy('expiry_date')
            ->get();

        return response()->json([
            'lowStock' => $lowStock,
            'expiring' => $expiring,
        ]);
    }
}
