import React from 'react';
import { DollarSign } from 'lucide-react';

export default function ProductPricingSection({ form, setForm, label, inp }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">2. Pricing &amp; Stock Inventory</h3>
                    <p className="text-[11px] text-slate-500">Define selling prices, optional discount offers, unit formats, and real-time stock levels.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <label className={label}>Selling Price (LKR) <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.selling_price ?? ''}
                        onChange={e => setForm({ ...form, selling_price: e.target.value })}
                        className={inp}
                        placeholder="e.g. 8500"
                    />
                </div>
                <div>
                    <label className={label}>Discount Price (LKR) <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.discount_price ?? ''}
                        onChange={e => setForm({ ...form, discount_price: e.target.value })}
                        className={inp}
                        placeholder="e.g. 7200"
                    />
                </div>
                <div>
                    <label className={label}>Stock Qty <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="number"
                        min="0"
                        value={form.current_stock ?? ''}
                        onChange={e => setForm({ ...form, current_stock: e.target.value })}
                        className={inp}
                        placeholder="e.g. 25"
                    />
                </div>
                <div>
                    <label className={label}>Unit Type</label>
                    <select
                        value={form.unit_type ?? 'piece'}
                        onChange={e => setForm({ ...form, unit_type: e.target.value })}
                        className={inp}
                    >
                        <option value="piece">piece</option>
                        <option value="bouquet">bouquet</option>
                        <option value="box">box</option>
                        <option value="hamper">hamper</option>
                        <option value="item">item</option>
                        <option value="1kg">1kg</option>
                        <option value="500g">500g</option>
                        <option value="pack">pack</option>
                    </select>
                </div>
                <div>
                    <label className={label}>Publishing Status</label>
                    <select
                        value={form.status ? 1 : 0}
                        onChange={e => setForm({ ...form, status: Number(e.target.value) })}
                        className={inp}
                    >
                        <option value={1}>Active (Visible in Catalog)</option>
                        <option value={0}>Inactive (Hidden)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
