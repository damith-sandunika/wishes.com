import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Search, UserCheck, ShoppingBag } from 'lucide-react';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCustomers = useCallback(() => {
        setLoading(true);
        axios.get(`/api/customers?search=${encodeURIComponent(search)}`)
            .then(res => setCustomers(res.data?.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(fetchCustomers, 300);
        return () => clearTimeout(timeout);
    }, [fetchCustomers]);

    return (
        <AdminLayout
            pageTitle="Customers"
            pageSubtitle="View and manage registered customer accounts & purchase history"
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search customer by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 transition shadow-xs"
                        />
                    </div>
                    <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                        Registered Customers: <span className="text-blue-600 font-bold">{customers.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">Customer</th>
                                <th className="px-6 py-3.5 font-semibold">Email</th>
                                <th className="px-6 py-3.5 font-semibold">Total Orders</th>
                                <th className="px-6 py-3.5 font-semibold">Total Spent</th>
                                <th className="px-6 py-3.5 text-right font-semibold">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-12 text-slate-400">Loading customers...</td></tr>
                            ) : customers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-slate-400">No registered customers found.</td></tr>
                            ) : customers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {u.name?.charAt(0) || 'U'}
                                        </div>
                                        {u.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{u.email}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs">
                                            <ShoppingBag size={12} className="text-slate-500" /> {u.orders_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-emerald-600 font-semibold">
                                        Rs. {Number(u.orders_sum_grand_total || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400 text-xs">
                                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
