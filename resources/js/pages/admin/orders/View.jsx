import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import { Printer, RefreshCw } from 'lucide-react';
import { printInvoice } from '../../../utils/printInvoice';
import OrderItemsCard from './OrderItemsCard';
import OrderDetailsCard from './OrderDetailsCard';
import OrderStatusCard from './OrderStatusCard';

export default function OrderView() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const fetchOrder = () => {
        setLoading(true);
        axios.get(`/api/orders/${id}`)
            .then(res => setOrder(res.data.data || res.data))
            .catch(() => setError('Order not found.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrder(); }, [id]);

    const handleUpdateStatus = async (field, value) => {
        setUpdating(true);
        try {
            const res = await axios.put(`/api/orders/${id}`, { [field]: value });
            setOrder(res.data.data || res.data);
        } catch {
            alert('Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateAdditionalCharge = async (amount, note) => {
        try {
            const res = await axios.put(`/api/orders/${id}`, {
                additional_charge: amount,
                additional_charge_note: note,
            });
            setOrder(res.data.data || res.data);
        } catch {
            alert('Failed to update additional charge.');
        }
    };

    if (loading) {
        return (
            <AdminLayout pageTitle="Order Details" pageSubtitle="Loading order logistics...">
                <div className="p-12 text-center text-slate-400 font-semibold text-xs">Loading order details...</div>
            </AdminLayout>
        );
    }

    if (!order || error) {
        return (
            <AdminLayout pageTitle="Order Not Found">
                <div className="p-12 text-center text-slate-500 font-semibold text-xs">
                    Order not found. <Link to="/admin/orders" className="text-blue-600 font-bold hover:underline">Back to Orders</Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            pageTitle={`Order #${order.invoice_number || order.id}`}
            pageSubtitle={`Tracking: ${order.tracking_number || 'N/A'} • Placed on ${new Date(order.created_at).toLocaleString()}`}
            headerActions={
                <button onClick={() => printInvoice(order)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm shadow-blue-500/20">
                    <Printer size={13} /> Print Invoice
                </button>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 columns: Items, Financials, Recipient & Logistics */}
                <div className="lg:col-span-2 space-y-6">
                    <OrderItemsCard
                        order={order}
                        onUpdateAdditionalCharge={handleUpdateAdditionalCharge}
                    />
                    <OrderDetailsCard order={order} />
                </div>

                {/* Right 1 column: Customer & Status Controls */}
                <div className="space-y-6">
                    <OrderStatusCard
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        updating={updating}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
