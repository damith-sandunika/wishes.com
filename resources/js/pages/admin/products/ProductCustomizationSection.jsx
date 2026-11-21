import React from 'react';
import { Palette, Sparkles, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import ProductAddonsSelector from './ProductAddonsSelector';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

const resolveImg = (s) => !s ? '' : ((s.startsWith('http://') || s.startsWith('https://')) ? s : `/storage/${s.replace(/^\/?(storage\/)?/, '')}`);

export default function ProductCustomizationSection({ form, setForm, colorFiles = {}, setColorFiles, label, inp }) {
    const colors = Array.isArray(form.color_variations) ? form.color_variations : [];

    const addColor = () => setForm({ ...form, color_variations: [...colors, { name: 'Pink', code: '#ec4899', extra_price: 0, image: '', description: '' }] });
    const updateColor = (i, f, v) => { const next = [...colors]; next[i] = { ...next[i], [f]: v }; setForm({ ...form, color_variations: next }); };
    const removeColor = (i) => {
        setForm({ ...form, color_variations: colors.filter((_, idx) => idx !== i) });
        if (setColorFiles) {
            const nextFiles = { ...colorFiles };
            delete nextFiles[i];
            setColorFiles(nextFiles);
        }
    };

    return (
        <div className="space-y-6">
            {/* Section 4: Color Variations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Palette size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">4. Color &amp; Palette Variations</h3>
                            <p className="text-[11px] text-slate-500">Add color options with photo previews that display dynamically when selected by customers.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={addColor}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors"
                    >
                        <Plus size={14} /> Add Color
                    </button>
                </div>

                {colors.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <p className="text-xs text-slate-500">No color variations added. The product will be sold in its default primary color.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {colors.map((c, i) => {
                            const file = colorFiles[i];
                            const preview = file ? URL.createObjectURL(file) : resolveImg(c.image);

                            return (
                                <div key={i} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                                        <div>
                                            <label className={label}>Color Name</label>
                                            <input
                                                type="text"
                                                value={c.name || ''}
                                                onChange={e => updateColor(i, 'name', e.target.value)}
                                                placeholder="e.g. Pastel Pink"
                                                className={inp}
                                            />
                                        </div>
                                        <div>
                                            <label className={label}>Hex Code</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={c.code || '#ec4899'}
                                                    onChange={e => updateColor(i, 'code', e.target.value)}
                                                    className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white"
                                                />
                                                <input
                                                    type="text"
                                                    value={c.code || '#ec4899'}
                                                    onChange={e => updateColor(i, 'code', e.target.value)}
                                                    className={inp}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={label}>Extra Charge (LKR)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={c.extra_price ?? ''}
                                                onChange={e => updateColor(i, 'extra_price', Number(e.target.value))}
                                                placeholder="0"
                                                className={inp}
                                            />
                                        </div>
                                        <div>
                                            <label className={label}>Color Photo (Shown on select)</label>
                                            <div className="flex items-center gap-2">
                                                {preview ? (
                                                    <img src={preview} alt="Color variant" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 bg-white" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-white border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-[10px] shrink-0 font-medium">
                                                        <ImageIcon size={14} />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept={ACCEPT_IMAGE_ATTR}
                                                    onChange={e => {
                                                        const f = e.target.files?.[0];
                                                        if (f && validateImageFile(f).valid && setColorFiles) {
                                                            setColorFiles({ ...colorFiles, [i]: f });
                                                        }
                                                    }}
                                                    className="text-[10px] w-full text-slate-500 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={c.description || ''}
                                                onChange={e => updateColor(i, 'description', e.target.value)}
                                                placeholder="Optional customer note for this color variation..."
                                                className={inp}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeColor(i)}
                                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Remove color"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Section 5: Personalization & Add-ons */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">5. Customized Items &amp; Add-ons</h3>
                        <p className="text-[11px] text-slate-500">Enable custom message cards, custom printing, and attach cross-selling add-on items.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={Boolean(form.enable_personalization)}
                            onChange={e => setForm({ ...form, enable_personalization: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <div>
                            <span className="text-xs font-bold text-slate-800 block">Enable Customization</span>
                            <span className="text-[11px] text-slate-400">Allows customer to add custom names, photos, or plaque messages.</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={form.enable_wrapping !== false}
                            onChange={e => setForm({ ...form, enable_wrapping: e.target.checked })}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <div>
                            <span className="text-xs font-bold text-slate-800 block">Enable Gift Wrapping</span>
                            <span className="text-[11px] text-slate-400">Offer luxury ribbon wrapping &amp; wax-sealed delivery packaging.</span>
                        </div>
                    </label>
                </div>

                <ProductAddonsSelector form={form} setForm={setForm} />
            </div>
        </div>
    );
}
