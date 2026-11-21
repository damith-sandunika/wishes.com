import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Printer, Eye, Search, Calendar, FileText } from 'lucide-react';
import { printInvoice } from '../../utils/printInvoice';

const TABS = ['All', 'Received', 'Confirmed', 'Delivered', 'Completed', 'Cancelled'];

export default function AdminOrders() {
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);

    const fetchOrders = useCallback(() => {
        setLoading(true);
        axios.get('/api/orders')
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setOrders(list);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (orderId, field, value) => {
        setUpdating(orderId);
        try {
            await axios.put(`/api/orders/${orderId}`, { [field]: value });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, [field]: value } : o));
        } catch (_) {}
        setUpdating(null);
    };

    const orderList = Array.isArray(orders) 
        ? orders 
        : (Array.isArray(orders?.data) ? orders.data : []);

    const filtered = orderList.filter(o => {
        const matchesTab = activeTab === 'All' 
            ? true 
            : activeTab === 'Received' 
                ? (o.delivery_status === 'Pending' || o.delivery_status === 'Received')
                : o.delivery_status === activeTab;

        if (!matchesTab) return false;

        if (search.trim()) {
            const s = search.toLowerCase();
            return (
                (o?.invoice_number || '').toLowerCase().includes(s) ||
                (o?.customer_name || '').toLowerCase().includes(s) ||
                (o?.whatsapp_number || '').includes(s)
            );
        }
        return true;
    });

    return (
        <AdminLayout
            pageTitle="Orders Logistics"
            pageSubtitle="Track floral and gift deliveries, manage invoice printing, and verify payments."
            headerActions={
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search invoice, customer, phone..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-blue-500 shadow-2xs w-full"
                        />
                    </div>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-1.5 p-2 border-b border-slate-100 overflow-x-auto scrollbar-hide bg-slate-50/50">
                    {TABS.map(tab => {
                        const count = tab === 'All' ? orderList.length : tab === 'Received'
                            ? orderList.filter(o => o.delivery_status === 'Pending' || o.delivery_status === 'Received').length
                            : orderList.filter(o => o.delivery_status === tab).length;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                    activeTab === tab ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                                }`}>
                                <span>{tab}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-5 py-3.5">Invoice</th>
                                <th className="px-5 py-3.5">Customer & Recipient</th>
                                <th className="px-5 py-3.5">Delivery Slot</th>
                                <th className="px-5 py-3.5">Amount</th>
                                <th className="px-5 py-3.5">Payment</th>
                                <th className="px-5 py-3.5">Delivery Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading orders...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-5 py-10 text-center text-slate-400 font-semibold">No orders found.</td></tr>
                            ) : filtered.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4 font-mono font-bold text-blue-700">
                                        #{order.invoice_number}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-900">{order.customer_name}</div>
                                        <div className="text-[11px] text-slate-400">{order.whatsapp_number}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                                            <Calendar size={13} className="text-slate-400" />
                                            {order.delivery_date || 'Standard'}
                                        </div>
                                        <div className="text-[10px] text-slate-400">{order.delivery_time_slot || 'Anytime'}</div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-slate-900">
                                        LKR {Number(order.grand_total).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <select
                                            value={order.payment_status}
                                            onChange={e => updateStatus(order.id, 'payment_status', e.target.value)}
                                            disabled={updating === order.id}
                                            className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white"
                                        >
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Refunded">Refunded</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-4">
                                        <select
                                            value={order.delivery_status}
                                            onChange={e => updateStatus(order.id, 'delivery_status', e.target.value)}
                                            disabled={updating === order.id}
                                            className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-200 bg-white"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link to={`/admin/orders/${order.id}`}
                                                className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Eye size={13} /> View
                                            </Link>
                                            <button onClick={() => printInvoice(order)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors" title="Print Invoice">
                                                <Printer size={14} />
                                            </button>
                                        </div>
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
