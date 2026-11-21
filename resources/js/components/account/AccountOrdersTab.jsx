import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, CheckCircle2, Clock } from 'lucide-react';

const STATUS_STEPS = ['Received', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered'];

export default function AccountOrdersTab({ orders }) {
    if (!Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="text-center py-12">
                <Package size={44} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-sm font-bold text-gray-800 mb-1">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 mb-5">When you order celebration gifts, their live progress will show here.</p>
                <Link to="/shop" className="inline-block bg-[#c8102e] text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-[#b91c1c] transition shadow-xs">
                    Explore Gift Catalog
                </Link>
            </div>
        );
    }

    const getStatusIndex = (status) => {
        const idx = STATUS_STEPS.indexOf(status);
        return idx !== -1 ? idx : 0;
    };

    return (
        <div className="space-y-4">
            {orders.map(order => {
                const currentIdx = getStatusIndex(order.delivery_status);
                const isDelivered = order.delivery_status === 'Delivered';

                return (
                    <div key={order.id} className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-xs transition bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-100">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-900">Order #{order.invoice_number || order.id}</span>
                                    <span className="text-[11px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                        Track: {order.tracking_number}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                                    <Calendar size={12} />
                                    <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${isDelivered ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {order.delivery_status || 'Pending'}
                                </span>
                                <Link 
                                    to={`/track-order?tracking=${order.tracking_number}`}
                                    className="text-xs font-semibold text-[#c8102e] hover:bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 transition"
                                >
                                    Track Delivery &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* Order Timeline Milestones */}
                        <div className="hidden sm:flex items-center justify-between my-4 px-2">
                            {STATUS_STEPS.map((step, idx) => {
                                const passed = idx <= currentIdx;
                                return (
                                    <div key={step} className="flex-1 flex items-center last:flex-none">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                passed ? 'bg-[#c8102e] text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {passed ? <CheckCircle2 size={12} /> : idx + 1}
                                            </div>
                                            <span className={`text-[10px] font-medium mt-1 ${passed ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                                                {step}
                                            </span>
                                        </div>
                                        {idx < STATUS_STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mx-2 ${idx < currentIdx ? 'bg-[#c8102e]' : 'bg-gray-200'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 pt-2 border-t border-gray-50">
                            <div>
                                <span>Recipient: <strong className="text-gray-800">{order.customer_name}</strong> ({order.customer_phone})</span>
                            </div>
                            <div className="text-right">
                                <span>Grand Total: <strong className="text-[#c8102e] text-sm font-bold">Rs. {Number(order.grand_total).toLocaleString()}</strong></span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
