import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import axios from 'axios';
import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/dashboard')
            .then(res => setStats(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const chartData = stats?.chartData || [];

    if (loading) {
        return (
            <AdminLayout pageTitle="Dashboard" pageSubtitle="Loading metrics...">
                <div className="h-64 flex items-center justify-center text-slate-400 font-semibold text-sm">
                    Loading dashboard analytics...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            pageTitle="Dashboard"
            pageSubtitle="Real-time sales, order fulfillment, and inventory analytics."
        >
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
                <AdminStatCard
                    label="Total Revenue"
                    value={`Rs. ${Number(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="emerald"
                    subtext="All-time paid orders"
                />
                <AdminStatCard
                    label="Total Orders"
                    value={Number(stats?.totalOrders || 0).toLocaleString()}
                    icon={ShoppingCart}
                    color="blue"
                    subtext={`${stats?.pendingOrders || 0} pending dispatch`}
                />
                <AdminStatCard
                    label="Registered Customers"
                    value={Number(stats?.totalCustomers || 0).toLocaleString()}
                    icon={Users}
                    color="purple"
                    subtext="Active buyer accounts"
                />
                <AdminStatCard
                    label="Estimated Profit"
                    value={`Rs. ${Number((stats?.totalRevenue || 0) * 0.7).toLocaleString()}`}
                    icon={TrendingUp}
                    color="rose"
                    subtext="Estimated 70% gross margin"
                />
            </div>

            {/* Chart and Side Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <TrendingUp size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Sales & Profit Trends</h3>
                                <p className="text-[11px] text-slate-400">Monthly financial performance</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                            Last 6 Months
                        </span>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }} />
                                <Line type="monotone" dataKey="gross" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Gross Revenue" />
                                <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Net Profit" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <span className="text-xs font-semibold text-slate-600">Gross Sales (LKR)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-slate-600">Net Profit (LKR)</span>
                        </div>
                    </div>
                </div>

                {/* Operations & Inventory Alerts */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Calendar size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">Store Health & Logistics</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3.5 bg-slate-50/75 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs">
                                        <ShoppingCart size={15} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Pending Orders</span>
                                </div>
                                <span className="text-base font-black text-slate-900 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                                    {stats?.pendingOrders || 0}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-slate-50/75 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs">
                                        <AlertCircle size={15} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Low Stock Warnings</span>
                                </div>
                                <span className="text-base font-black text-rose-600 px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200">
                                    {stats?.lowStock || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-5 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">System Status</p>
                            <h4 className="text-base font-bold mt-1">Orders Pipeline Active</h4>
                            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                                Automated WhatsApp customer notifications and stock synchronization are live.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
