<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        // Estatísticas gerais
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalRevenue = Order::sum('total');
        $lowStockProducts = Product::where('qty_stock', '<', 10)->count();

        // Pedidos recentes
        $recentOrders = Order::with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Produtos com estoque baixo
        $lowStockList = Product::where('qty_stock', '<', 10)
            ->orderBy('qty_stock', 'asc')
            ->limit(5)
            ->get(['id', 'name', 'qty_stock']);

        // Estatísticas de pedidos (últimos 30 dias)
        $ordersLast30Days = Order::where('created_at', '>=', now()->subDays(30))
            ->count();

        $revenueLast30Days = Order::where('created_at', '>=', now()->subDays(30))
            ->sum('total');

        return Inertia::render('dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalRevenue' => (float) $totalRevenue,
                'lowStockProducts' => $lowStockProducts,
                'ordersLast30Days' => $ordersLast30Days,
                'revenueLast30Days' => (float) $revenueLast30Days,
            ],
            'recentOrders' => $recentOrders,
            'lowStockList' => $lowStockList,
        ]);
    }
}



