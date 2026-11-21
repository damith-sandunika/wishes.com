import React from 'react';

export default function CouponModal({ show, onClose, onSave, form, setForm, saving }) {
    if (!show) return null;

    const inp = "w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-xs font-medium";

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-base mb-4 text-slate-900 border-b border-slate-100 pb-3">Create Promotion / Coupon</h3>
                <form onSubmit={onSave} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Coupon Code</label>
                            <input 
                                required 
                                value={form.code} 
                                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} 
                                className={inp} 
                                placeholder="e.g. WISHES20" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Type</label>
                            <select 
                                value={form.discount_type} 
                                onChange={e => setForm({ ...form, discount_type: e.target.value })} 
                                className={inp}
                            >
                                <option value="percent">Percentage Discount (%)</option>
                                <option value="fixed">Fixed Flat Amount (Rs.)</option>
                                <option value="free_delivery">Free Delivery Coupon</option>
                            </select>
                        </div>
                    </div>

                    {form.discount_type === 'percent' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Discount Percent (%)</label>
                                <input 
                                    required 
                                    type="number" 
                                    min="1" 
                                    max="100" 
                                    value={form.discount_percent} 
                                    onChange={e => setForm({ ...form, discount_percent: e.target.value })} 
                                    className={inp} 
                                    placeholder="15" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Max Discount Cap (Rs.) - Optional</label>
                                <input 
                                    type="number" 
                                    value={form.max_discount || ''} 
                                    onChange={e => setForm({ ...form, max_discount: e.target.value })} 
                                    className={inp} 
                                    placeholder="2000" 
                                />
                            </div>
                        </div>
                    )}

                    {form.discount_type === 'fixed' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Flat Discount Amount (Rs.)</label>
                            <input 
                                required 
                                type="number" 
                                min="10" 
                                value={form.discount_amount || ''} 
                                onChange={e => setForm({ ...form, discount_amount: e.target.value })} 
                                className={inp} 
                                placeholder="500" 
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Min Order Spend (Bulk / Min Cart)</label>
                            <input 
                                type="number" 
                                value={form.min_spend || ''} 
                                onChange={e => setForm({ ...form, min_spend: e.target.value })} 
                                className={inp} 
                                placeholder="e.g. 5000 (Optional)" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Valid Until (Expiry Date)</label>
                            <input 
                                type="date" 
                                value={form.valid_until || ''} 
                                onChange={e => setForm({ ...form, valid_until: e.target.value })} 
                                className={inp} 
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                id="is_flash_sale" 
                                checked={form.is_flash_sale} 
                                onChange={e => setForm({ ...form, is_flash_sale: e.target.checked })} 
                                className="w-4 h-4 text-blue-600 rounded-sm"
                            />
                            <label htmlFor="is_flash_sale" className="text-xs font-bold text-slate-800">
                                ⚡ Display as Live Flash Sale / Promo Banner
                            </label>
                        </div>
                        {form.is_flash_sale && (
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Banner Announcement Text for Customers</label>
                                <input 
                                    value={form.banner_text || ''} 
                                    onChange={e => setForm({ ...form, banner_text: e.target.value })} 
                                    className={inp} 
                                    placeholder="e.g. 🔥 Weekend Flash Sale: Use code WISHES15 for 15% OFF!" 
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Promotion'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
