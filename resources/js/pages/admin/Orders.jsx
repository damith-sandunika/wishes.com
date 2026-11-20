import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { Printer } from 'lucide-react';
import { printInvoice } from '../../utils/printInvoice';

const tabs = ['Received', 'Confirmed', 'Delivered', 'Completed', 'Cancelled'];

const statusColors = {
    Received:   'bg-blue-100 text-blue-700 border-blue-200',
    Pending:    'bg-blue-100 text-blue-700 border-blue-200',
    Confirmed:  'bg-indigo-100 text-indigo-700 border-indigo-200',
    Delivered:  'bg-orange-100 text-orange-700 border-orange-200',
    Completed:  'bg-emerald-100 text-emerald-700 border-emerald-200',
    Cancelled:  'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrders() {
    const [activeTab, setActiveTab] = useState('Received');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchOrders = useCallback(() => {
        setLoading(true);
        axios.get('/api/orders')
            .then(res => setOrders(Array.isArray(res.data) ? res.data : (res.data.data || [])))
            .catch(() => {})
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

    const handlePrintInvoice = (order) => {
        printInvoice(order);
    };

    const filtered = orders.filter(o => {
        if (activeTab === 'Received') return o.delivery_status === 'Pending' || o.delivery_status === 'Received';
        if (activeTab === 'Confirmed') return o.delivery_status === 'Confirmed';
        if (activeTab === 'Delivered') return o.delivery_status === 'Delivered';
        if (activeTab === 'Completed') return o.delivery_status === 'Completed';
        if (activeTab === 'Cancelled') return o.delivery_status === 'Cancelled';
        return true;
    });

    return (
        <AdminLayout>
            {/* Exact Title Section from Education Center Classes/Index.jsx */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Orders Management</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Manage Orders</p>
                </div>
            </div>

            {/* Flat Tabs without Border Radius */}
            <div className="border-b border-gray-200 mb-6 flex">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-normal transition-colors border-b-2 ${
                            activeTab === tab 
                            ? 'border-[#1933C6] text-[#1933C6]' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table matched to Education Center Classes/Index.jsx */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Invoice & Date</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Total Amount</th>
                                <th className="px-6 py-3">Payment</th>
                                <th className="px-6 py-3">Delivery Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">No orders found.</td></tr>
                            ) : filtered.map((order) => (
                                <tr key={order.id} className={`hover:bg-gray-50 transition ${updating === order.id ? 'opacity-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-[#1933C6] font-normal">{order.invoice_number}</div>
                                        <div className="text-gray-500 text-xs mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-normal text-gray-900">{order.customer_name}</div>
                                        <div className="text-gray-600 text-xs mt-1">{order.whatsapp_number}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-normal">
                                        Rs.{Number(order.grand_total).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div>{order.payment_method}</div>
                                        {order.payment_slip && (
                                            <a href={`/storage/${order.payment_slip}`} target="_blank" className="text-xs text-blue-600 underline mt-1 inline-block" rel="noreferrer">View Receipt</a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.delivery_status === 'Pending' ? 'Received' : (order.delivery_status || 'Received')}
                                            onChange={e => updateStatus(order.id, 'delivery_status', e.target.value)}
                                            className={`text-xs border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal ${statusColors[order.delivery_status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                        >
                                            <option value="Received">Received</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => printInvoice(order)} className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-normal inline-flex items-center gap-1" title="Print Invoice">
                                            <Printer size={14} /> Print
                                        </button>
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
