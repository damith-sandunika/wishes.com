import React from 'react';
import { Package, RefreshCw } from 'lucide-react';

export default function ProductBasicInfoSection({ form, setForm, categories, suppliers, label, inp }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">1. Basic Information &amp; Identity</h3>
                    <p className="text-[11px] text-slate-500">Core catalog details, category assignment, and product copywriting.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                    <label className={label}>Product Name <span className="text-red-500">*</span></label>
                    <input
                        required
                        type="text"
                        value={form.name ?? ''}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className={inp}
                        placeholder="e.g. Royal Red Rose Luxury Bouquet"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            SKU Identifier
                        </label>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, sku: 'WSH-' + Math.random().toString(36).substring(2, 8).toUpperCase() })}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Generate new unique SKU"
                        >
                            <RefreshCw size={11} /> Auto-Generate
                        </button>
                    </div>
                    <input
                        type="text"
                        value={form.sku ?? ''}
                        onChange={e => setForm({ ...form, sku: e.target.value })}
                        className={`${inp} font-mono uppercase`}
                        placeholder="e.g. WSH-XXXXXX"
                    />
                </div>
                <div>
                    <label className={label}>Category <span className="text-red-500">*</span></label>
                    <select
                        required
                        value={String(form.category_id ?? '')}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                        className={inp}
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                            <option key={c.id} value={String(c.id)}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={label}>Supplier / Florist (Optional)</label>
                    <select
                        value={String(form.supplier_id ?? '')}
                        onChange={e => setForm({ ...form, supplier_id: e.target.value })}
                        className={inp}
                    >
                        <option value="">Select Supplier (Optional)</option>
                        {suppliers.map(s => (
                            <option key={s.id} value={String(s.id)}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={label}>
                        Product Card Subtitle / Tagline <span className="text-blue-600 font-semibold">(Shown directly under title on cards)</span>
                    </label>
                    <input
                        type="text"
                        value={form.short_description ?? ''}
                        onChange={e => setForm({ ...form, short_description: e.target.value })}
                        className={inp}
                        placeholder="e.g. Fresh Dutch Red Roses with Gypsophila &amp; Ribbon"
                    />
                </div>
            </div>

            <div>
                <label className={label}>Full Product Description &amp; Care Details</label>
                <textarea
                    rows={4}
                    value={form.description ?? ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className={`${inp} resize-y min-h-[90px]`}
                    placeholder="Enter complete product description, flower care instructions, dimensions, materials, and packaging details..."
                />
            </div>
        </div>
    );
}
