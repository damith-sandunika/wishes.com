import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'Admin User' };

    useEffect(() => {
        axios.get('/api/dashboard')
            .then(res => setStats(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const chartData = stats?.chartData || [];

    if (loading) return <AdminLayout><div className="flex h-full items-center justify-center text-gray-500 font-normal">Loading dashboard...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-[1600px] mx-auto">
                {/* Page Header */}
                <div className="mb-6 bg-white rounded-md p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                        <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                        <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                        <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                        <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-normal text-slate-400 tracking-widest uppercase mb-1">Good Morning</p>
                        <h2 className="text-2xl font-normal text-slate-800 tracking-tight">{user.name}</h2>
                        <p className="text-[11px] font-normal text-slate-400 uppercase tracking-widest mt-1">Admin Dashboard Overview</p>
                    </div>
                    <div className="relative z-10 hidden sm:flex">
                        <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-lg flex items-center justify-center">
                            <span className="text-[#1933C6] font-normal text-xl">{user.name.charAt(0)}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                    {/* Card 1 */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-b-2 border-b-emerald-500 border border-slate-200 flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-normal text-slate-800">Rs. {Number(stats?.totalRevenue || 0).toLocaleString()}</h3>
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wider mt-1">Total Revenue</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-b-2 border-b-blue-500 border border-slate-200 flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <ShoppingCart size={20} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-normal text-slate-800">{stats?.totalOrders || 0}</h3>
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wider mt-1">Total Orders</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-b-2 border-b-indigo-500 border border-slate-200 flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-normal text-slate-800">{stats?.totalCustomers || 0}</h3>
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wider mt-1">Total Customers</p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border-b-2 border-b-emerald-600 border border-slate-200 flex flex-col justify-between">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-normal text-slate-800">Rs. {Number((stats?.totalRevenue || 0) * 0.7).toLocaleString()}</h3>
                            <p className="text-[10px] font-normal text-slate-400 uppercase tracking-wider mt-1">Net Profit (Est)</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Chart and Side panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1933C6] flex items-center justify-center">
                                    <TrendingUp size={16} />
                                </div>
                                <h3 className="font-normal text-slate-800 text-sm">Revenue & Profit Trend</h3>
                            </div>
                            <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider">Last 6 Months</span>
                        </div>
                        
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }} />
                                    <Line type="monotone" dataKey="gross" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Gross Revenue" />
                                    <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Net Profit" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-[10px] font-normal text-slate-500">Gross Revenue (Rs.)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] font-normal text-slate-500">Net Profit (Rs.)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Operations & Recent */}
                    <div className="space-y-6">
                        
                        {/* Active Operations */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Calendar size={16} />
                                </div>
                                <h3 className="font-normal text-slate-800 text-sm">Active Operations</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                                            <ShoppingCart size={14} />
                                        </div>
                                        <span className="text-xs font-normal text-slate-700 uppercase tracking-wider">Pending Orders</span>
                                    </div>
                                    <span className="text-lg font-normal text-slate-900">{stats?.pendingOrders || 0}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                                            <AlertCircle size={14} />
                                        </div>
                                        <span className="text-xs font-normal text-slate-700 uppercase tracking-wider">Low Stock</span>
                                    </div>
                                    <span className="text-lg font-normal text-orange-600">{stats?.lowStock || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <DollarSign size={16} />
                                </div>
                                <h3 className="font-normal text-slate-800 text-sm">Recent Activity</h3>
                            </div>
                            <div className="py-6 text-center">
                                <p className="text-xs font-normal text-slate-400">System is running smoothly.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
