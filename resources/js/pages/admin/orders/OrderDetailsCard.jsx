import React from 'react';
import { MapPin, Calendar, Clock, Gift, FileText, Download, Phone, CreditCard } from 'lucide-react';

export default function OrderDetailsCard({ order }) {
    const slipUrl = order.payment_slip
        ? (order.payment_slip.startsWith('http') ? order.payment_slip : `/storage/${order.payment_slip.replace(/^\/?(storage\/)?/, '')}`)
        : null;

    return (
        <div className="space-y-4">
            {/* Recipient & Logistics Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <MapPin size={16} className="text-[#c8102e]" />
                        <span>Recipient &amp; Delivery Logistics</span>
                    </h3>
                    {order.gift_wrapping && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                            🎁 Gift Wrapped
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Recipient Name</span>
                        <p className="font-bold text-slate-800">{order.recipient_name || order.customer_name}</p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Recipient Contact</span>
                        <p className="font-semibold text-slate-700 flex items-center gap-1">
                            <Phone size={12} className="text-slate-400" />
                            <a href={`tel:${order.recipient_phone || order.whatsapp_number}`} className="hover:underline text-blue-600">
                                {order.recipient_phone || order.whatsapp_number}
                            </a>
                        </p>
                    </div>
                    <div className="sm:col-span-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Delivery Address</span>
                        <p className="text-slate-700 leading-relaxed font-medium">
                            {order.delivery_address}
                            {order.city ? `, ${order.city}` : ''}
                            {order.district ? `, ${order.district}` : ''}
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Requested Date</span>
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Calendar size={13} className="text-blue-600" />
                            {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Standard Dispatch'}
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Delivery Time Slot</span>
                        <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <Clock size={13} className="text-blue-600" />
                            {order.delivery_time_slot || 'Anytime between 9 AM - 6 PM'}
                        </p>
                    </div>
                </div>

                {/* Gift Message Card */}
                {order.gift_message && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Gift size={13} /> Heartfelt Gift Note Included
                        </span>
                        <p className="text-xs text-amber-950 font-serif italic whitespace-pre-line leading-relaxed">
                            "{order.gift_message}"
                        </p>
                    </div>
                )}
            </div>

            {/* Payment & Slips Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <CreditCard size={16} className="text-emerald-600" />
                        <span>Payment &amp; Proof of Transfer</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-700">{order.payment_method}</span>
                </div>

                {slipUrl ? (
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Bank Transfer Slip Preview</span>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <a href={slipUrl} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs hover:opacity-90 transition">
                                <img src={slipUrl} alt="Slip" className="w-full h-full object-cover" />
                            </a>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">Customer Slip Document</p>
                                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Attached via Checkout</span>
                                <a href={`/api/orders/${order.id}/slip`} download className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-1">
                                    <Download size={12} /> Download Original Document
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-medium">
                        {order.payment_method === 'Bank Transfer' ? 'No transfer receipt attached yet.' : `Processed through ${order.payment_method}.`}
                    </div>
                )}
            </div>
        </div>
    );
}
