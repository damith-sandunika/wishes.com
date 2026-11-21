<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $year = (int) ($request->year ?? now()->year);
        $startOfYear = Carbon::create($year, 1, 1)->startOfDay();
        $endOfYear = Carbon::create($year, 12, 31)->endOfDay();

        $monthly = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as total_orders, SUM(grand_total) as revenue')
            ->whereBetween('created_at', [$startOfYear, $endOfYear])
            ->where('payment_status', 'Paid')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();

        $totalRevenue = (float) Order::where('payment_status', 'Paid')->sum('grand_total');
        $totalOrders = Order::count();
        $avgOrder = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        $topProducts = OrderItem::selectRaw('product_name, SUM(quantity) as total_sold, SUM(total_price) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        return response()->json([
            'monthly' => $monthly,
            'totalRevenue' => round($totalRevenue, 2),
            'totalOrders' => $totalOrders,
            'avgOrder' => round($avgOrder, 2),
            'topProducts' => $topProducts,
        ]);
    }

    public function payments()
    {
        $pendingOrders = Order::where('payment_status', 'Pending')
            ->select('id', 'invoice_number', 'customer_name', 'customer_phone', 'payment_method', 'grand_total', 'delivery_status', 'payment_slip', 'created_at')
            ->latest()
            ->get();

        $totalPendingAmount = (float) $pendingOrders->sum('grand_total');
        $totalPendingCount = $pendingOrders->count();

        $methodBreakdown = Order::where('payment_status', 'Pending')
            ->selectRaw('payment_method, COUNT(*) as count, SUM(grand_total) as total')
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'totalPendingAmount' => round($totalPendingAmount, 2),
            'totalPendingCount' => $totalPendingCount,
            'methodBreakdown' => $methodBreakdown,
            'pendingOrders' => $pendingOrders,
        ]);
    }

    public function products()
    {
        $products = Product::with('category')
            ->withCount(['orderItems as total_units_sold' => function ($query) {
                $query->selectRaw('COALESCE(SUM(quantity), 0)');
            }])
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'category' => $p->category?->name ?? 'Uncategorized',
                    'price' => (float)$p->price,
                    'current_stock' => (int)$p->current_stock,
                    'units_sold' => (int)$p->total_units_sold,
                    'revenue' => (float)$p->price * (int)$p->total_units_sold,
                    'status' => $p->status,
                ];
            })
            ->sortByDesc('units_sold')
            ->values();

        return response()->json($products);
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
