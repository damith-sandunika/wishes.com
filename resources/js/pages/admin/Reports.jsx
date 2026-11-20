import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Download } from 'lucide-react';

export default function AdminReports() {
    const [sales, setSales] = useState(null);
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            axios.get('/api/reports/sales'),
            axios.get('/api/reports/stock')
        ]).then(([rSales, rStock]) => {
            setSales(rSales.data);
            setStock(rStock.data);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <AdminLayout><div className="p-6 text-gray-500">Loading reports...</div></AdminLayout>;

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Reports</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Sales and Inventory Analytics</p>
                </div>
                <button className="relative z-10 bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Download size={16} strokeWidth={2.5} /> Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Summary */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-normal text-slate-800 border-b border-slate-100 pb-4 mb-4">Sales Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                            <p className="text-xs text-emerald-700 font-normal uppercase tracking-wider mb-1">Total Revenue</p>
                            <h4 className="text-2xl font-normal text-slate-900">Rs.{Number(sales?.totalRevenue || 0).toLocaleString()}</h4>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-[#1933C6] font-normal uppercase tracking-wider mb-1">Total Orders</p>
                            <h4 className="text-2xl font-normal text-slate-900">{sales?.totalOrders || 0}</h4>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-normal text-slate-800 border-b border-slate-100 pb-4 mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {sales?.topProducts?.length > 0 ? sales.topProducts.map((p, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                <span className="text-slate-700 font-normal">{p.product_name}</span>
                                <div className="text-right">
                                    <span className="block font-normal text-slate-900">{p.total_sold} units</span>
                                    <span className="text-[10px] text-emerald-600 font-normal">Rs.{Number(p.revenue).toLocaleString()}</span>
                                </div>
                            </div>
                        )) : <p className="text-slate-400 text-sm">No sales data yet.</p>}
                    </div>
                </div>

                {/* Low Stock & Expiring */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
                    <h3 className="font-normal text-slate-800 border-b border-slate-100 pb-4 mb-4">Inventory Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-normal text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">⚠️ Low Stock Alerts</h4>
                            {stock?.lowStock?.length > 0 ? (
                                <ul className="space-y-2">
                                    {stock.lowStock.map(p => (
                                        <li key={p.id} className="flex justify-between text-sm p-2 bg-red-50 border border-red-100 rounded-md">
                                            <span className="text-slate-700 font-normal">{p.name}</span>
                                            <span className="font-normal text-red-600">{p.current_stock} left</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-slate-500">All stock levels are healthy.</p>}
                        </div>
                        <div>
                            <h4 className="text-xs font-normal text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-2">⏳ Expiring Soon (30 Days)</h4>
                            {stock?.expiring?.length > 0 ? (
                                <ul className="space-y-2">
                                    {stock.expiring.map(p => (
                                        <li key={p.id} className="flex justify-between text-sm p-2 bg-orange-50 border border-orange-100 rounded-md">
                                            <span className="text-slate-700 font-normal">{p.name}</span>
                                            <span className="font-normal text-orange-600">{new Date(p.expiry_date).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-xs text-slate-500">No products expiring soon.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
