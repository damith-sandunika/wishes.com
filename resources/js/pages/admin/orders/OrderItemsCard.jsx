import React, { useState } from 'react';
import { Package, PlusCircle, Edit3, Check, X } from 'lucide-react';

export default function OrderItemsCard({ order, onUpdateAdditionalCharge }) {
    const [isEditingCharge, setIsEditingCharge] = useState(false);
    const [chargeAmount, setChargeAmount] = useState(order.additional_charge || '');
    const [chargeNote, setChargeNote] = useState(order.additional_charge_note || '');
    const [saving, setSaving] = useState(false);

    const items = Array.isArray(order.items) ? order.items : [];

    const handleSaveCharge = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onUpdateAdditionalCharge(chargeAmount === '' ? 0 : Number(chargeAmount), chargeNote);
        setSaving(false);
        setIsEditingCharge(false);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <Package size={16} className="text-blue-600" />
                    <span>Ordered Items ({items.length})</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">#{order.invoice_number}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                        <tr>
                            <th className="py-2.5 px-4">Product Details</th>
                            <th className="py-2.5 px-4 text-center">Unit Price</th>
                            <th className="py-2.5 px-4 text-center">Qty</th>
                            <th className="py-2.5 px-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4">
                                    <p className="font-bold text-slate-800 text-xs">{item.product_name}</p>
                                    {item.product?.category && (
                                        <span className="text-[10px] text-slate-400">{item.product.category.name}</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center font-medium text-slate-600">
                                    Rs. {Number(item.unit_price).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-slate-800">
                                    {item.quantity}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-slate-900">
                                    Rs. {Number(item.total_price).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Financial Summary with Additional Charge feature */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">Rs. {Number(order.sub_total || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge</span>
                    <span className="font-semibold text-slate-800">Rs. {Number(order.delivery_charge || 0).toLocaleString()}</span>
                </div>
                {Number(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                        <span>- Rs. {Number(order.discount_amount).toLocaleString()}</span>
                    </div>
                )}

                {/* Additional Charges Section */}
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                    {!isEditingCharge ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-bold text-slate-700 text-xs">Additional Charges:</span>
                                {order.additional_charge_note && (
                                    <span className="text-[11px] text-slate-500 ml-2 italic">({order.additional_charge_note})</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-blue-700 text-xs">
                                    + Rs. {Number(order.additional_charge || 0).toLocaleString()}
                                </span>
                                <button onClick={() => { setIsEditingCharge(true); setChargeAmount(order.additional_charge || ''); setChargeNote(order.additional_charge_note || ''); }}
                                    className="p-1 hover:bg-amber-100 text-slate-500 hover:text-slate-800 rounded transition" title="Modify extra fee">
                                    <Edit3 size={13} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSaveCharge} className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-800 block">Set Custom Additional Charge</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" step="0.01" value={chargeAmount} onChange={e => setChargeAmount(e.target.value)}
                                    placeholder="Amount (Rs)" className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-none bg-white font-bold" />
                                <input type="text" value={chargeNote} onChange={e => setChargeNote(e.target.value)}
                                    placeholder="Reason (e.g. Midnight Rush Fee)" className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 outline-none bg-white" />
                            </div>
                            <div className="flex justify-end gap-1.5 pt-1">
                                <button type="button" onClick={() => setIsEditingCharge(false)} className="px-2 py-1 text-slate-500 hover:bg-slate-200 rounded text-[11px] font-semibold">Cancel</button>
                                <button type="submit" disabled={saving} className="px-3 py-1 bg-blue-600 text-white rounded text-[11px] font-bold hover:bg-blue-700 shadow-xs">
                                    {saving ? 'Saving...' : 'Apply Charge'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                    <span className="font-black text-sm text-slate-900">Grand Total</span>
                    <span className="font-black text-lg text-[#c8102e]">Rs. {Number(order.grand_total).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
