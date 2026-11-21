import React from 'react';
import { User, MessageCircle, RefreshCw, History, ShieldCheck } from 'lucide-react';

const STATUS_COLORS = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Received: 'bg-blue-50 text-blue-700 border-blue-200',
    Confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Processing: 'bg-purple-50 text-purple-700 border-purple-200',
    Shipped: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function OrderStatusCard({ order, onUpdateStatus, updating }) {
    const histories = Array.isArray(order.statusHistories) ? order.statusHistories : [];
    const cleanPhone = (order.whatsapp_number || '').replace(/[^\d+]/g, '');

    return (
        <div className="space-y-4">
            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <User size={16} className="text-blue-600" />
                        <span>Customer Profile</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {order.user_id || 'Guest'}</span>
                </div>

                <div className="space-y-2 text-xs">
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Sender Name</span>
                        <p className="font-bold text-slate-800">{order.customer_name}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">WhatsApp Contact</span>
                        <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-0.5">
                            <MessageCircle size={14} /> {order.whatsapp_number}
                        </a>
                    </div>
                    {order.order_notes && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Customer Instructions</span>
                            <p className="text-slate-600 italic text-[11px]">{order.order_notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Management Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#c8102e]" />
                        <span>Logistics &amp; Status Controls</span>
                    </h3>
                    {updating && <RefreshCw size={13} className="animate-spin text-blue-600" />}
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Delivery Status</label>
                        <select
                            value={order.delivery_status || 'Pending'}
                            onChange={e => onUpdateStatus('delivery_status', e.target.value)}
                            disabled={updating}
                            className={`w-full text-xs font-bold px-3 py-2 rounded-xl border outline-none ${
                                STATUS_COLORS[order.delivery_status] || 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                        >
                            <option value="Pending">⏳ Pending Verification</option>
                            <option value="Received">📥 Received</option>
                            <option value="Confirmed">✅ Confirmed</option>
                            <option value="Processing">📦 In Production / Preparing</option>
                            <option value="Shipped">🚚 Out for Delivery</option>
                            <option value="Delivered">🎉 Delivered Successfully</option>
                            <option value="Cancelled">❌ Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Payment Status</label>
                        <select
                            value={order.payment_status || 'Pending'}
                            onChange={e => onUpdateStatus('payment_status', e.target.value)}
                            disabled={updating}
                            className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 outline-none bg-slate-50 text-slate-800"
                        >
                            <option value="Pending">⏳ Pending Payment</option>
                            <option value="Paid">💳 Paid &amp; Verified</option>
                            <option value="Failed">⚠️ Payment Failed</option>
                            <option value="Refunded">🔄 Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Audit Timeline */}
                {histories.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                            <History size={12} /> Status Timeline
                        </span>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {histories.map(h => (
                                <div key={h.id} className="text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-baseline font-semibold text-slate-700">
                                        <span>{h.to_status}</span>
                                        <span className="text-[9px] text-slate-400">{new Date(h.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{h.notes}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
