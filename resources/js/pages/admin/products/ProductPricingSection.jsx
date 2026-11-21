import React from 'react';

export default function ProductPricingSection({ form, setForm, label, inp }) {
    return (
        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-normal text-slate-800 mb-4 border-b border-slate-200 pb-2">Pricing &amp; Stock</h3>
            <div className="space-y-4">
                <div>
                    <label className={label}>Selling Price (LKR) <span className="text-red-500">*</span></label>
                    <input required type="number" value={form.selling_price ?? ''} onChange={e => setForm({...form, selling_price: e.target.value})} className={inp} />
                </div>
                <div>
                    <label className={label}>Discount Price (LKR) (Optional)</label>
                    <input type="number" value={form.discount_price ?? ''} onChange={e => setForm({...form, discount_price: e.target.value})} className={inp} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Stock Qty <span className="text-red-500">*</span></label>
                        <input required type="number" value={form.current_stock ?? ''} onChange={e => setForm({...form, current_stock: e.target.value})} className={inp} />
                    </div>
                    <div>
                        <label className={label}>Unit</label>
                        <select value={form.unit_type ?? 'piece'} onChange={e => setForm({...form, unit_type: e.target.value})} className={inp}>
                            <option value="item">item</option>
                            <option value="piece">piece</option>
                            <option value="box">box</option>
                            <option value="bouquet">bouquet</option>
                            <option value="hamper">hamper</option>
                            <option value="1kg">1kg</option>
                            <option value="500g">500g</option>
                            <option value="pack">pack</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className={label}>Status</label>
                    <select value={form.status ? 1 : 0} onChange={e => setForm({...form, status: Number(e.target.value)})} className={inp}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
