import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Palette, Sparkles, Gift } from 'lucide-react';
import axios from 'axios';

const DEFAULT_ADDONS = [
    { id: 'card', name: 'Handwritten Greeting Card', price: 350, icon: '💌' },
    { id: 'teddy', name: 'Mini Cuddle Teddy Bear', price: 1500, icon: '🧸' },
    { id: 'ferrero', name: 'Ferrero Rocher Box', price: 950, icon: '🍫' },
    { id: 'candle', name: 'Scented Vanilla Candle', price: 1200, icon: '🕯️' },
];

export default function ProductCustomizationSection({ form, setForm, label, inp, extraFiles, setExtraFiles }) {
    const colors = form.color_variations || [];
    const addons = form.allowed_addons || ['card', 'teddy', 'ferrero', 'candle'];
    const occasions = form.occasions || [];
    const [availableAddons, setAvailableAddons] = useState(DEFAULT_ADDONS);
    const [occasionsList, setOccasionsList] = useState([]);

    useEffect(() => {
        axios.get('/api/public/settings').then(res => {
            const raw = res.data?.gift_addons_options;
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (Array.isArray(parsed) && parsed.length > 0) setAvailableAddons(parsed.filter(a => a.active !== false));
                } catch {}
            }
        }).catch(() => {});
        axios.get('/api/public/occasions').then(res => setOccasionsList(res.data || [])).catch(() => {});
    }, []);

    const toggleOccasion = (slug) => {
        const next = occasions.includes(slug) ? occasions.filter(s => s !== slug) : [...occasions, slug];
        setForm({ ...form, occasions: next });
    };

    const addColor = () => {
        const next = [...colors, { name: 'Red', code: '#c8102e', extra_price: 0, image: '', description: '' }];
        setForm({ ...form, color_variations: next });
    };

    const updateColor = (index, field, val) => {
        const next = [...colors];
        next[index] = { ...next[index], [field]: val };
        setForm({ ...form, color_variations: next });
    };

    const removeColor = (index) => {
        setForm({ ...form, color_variations: colors.filter((_, i) => i !== index) });
    };

    const toggleAddon = (id) => {
        const next = addons.includes(id) ? addons.filter(a => a !== id) : [...addons, id];
        setForm({ ...form, allowed_addons: next });
    };

    return (
        <div className="space-y-6">
            {/* Extra Product Images (Up to 3 Extra Images) */}
            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-medium text-slate-800 text-sm mb-3 border-b border-slate-200 pb-2">
                    Gallery Images (Up to 3 Extra Angles)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Extra Image {idx + 1}</span>
                            {form.images && form.images[idx + 1] && !extraFiles[idx] && (
                                <img src={`/storage/${form.images[idx + 1]}`} alt={`Extra ${idx + 1}`} className="w-12 h-12 mx-auto rounded object-cover mb-2 border border-slate-100" />
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => {
                                    const next = [...extraFiles];
                                    next[idx] = e.target.files[0];
                                    setExtraFiles(next);
                                }}
                                className="text-[10px] w-full file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-[#1933C6]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Variations */}
            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                        <Palette size={16} className="text-[#1933C6]" />
                        <h3 className="font-medium text-slate-800 text-sm">Color Variations</h3>
                    </div>
                    <button type="button" onClick={addColor} className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-[#1933C6] font-semibold px-2.5 py-1 rounded-md hover:bg-blue-100 transition">
                        <Plus size={12} /> Add Color
                    </button>
                </div>

                {colors.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No color variations added. Base product color will be used.</p>
                ) : (
                    <div className="space-y-3">
                        {colors.map((c, i) => (
                            <div key={i} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-medium">Color Name</label>
                                        <input type="text" value={c.name} onChange={e => updateColor(i, 'name', e.target.value)} placeholder="e.g. Pink" className={inp} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-medium">Color Code</label>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={c.code} onChange={e => updateColor(i, 'code', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                                            <input type="text" value={c.code} onChange={e => updateColor(i, 'code', e.target.value)} className={inp} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-medium">Extra Charge (Rs)</label>
                                        <input type="number" value={c.extra_price || ''} onChange={e => updateColor(i, 'extra_price', Number(e.target.value))} placeholder="0" className={inp} />
                                    </div>
                                    <div className="flex items-end justify-between gap-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] text-slate-500 uppercase font-medium">Variant Img URL</label>
                                            <input type="text" value={c.image || ''} onChange={e => updateColor(i, 'image', e.target.value)} placeholder="URL or leave blank" className={inp} />
                                        </div>
                                        <button type="button" onClick={() => removeColor(i)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <input type="text" value={c.description || ''} onChange={e => updateColor(i, 'description', e.target.value)} placeholder="Optional note for this color..." className={inp} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Personalization & Addons */}
            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Sparkles size={16} className="text-[#1933C6]" />
                    <h3 className="font-medium text-slate-800 text-sm">Personalization &amp; Addons</h3>
                </div>

                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={!!form.enable_personalization} onChange={e => setForm({ ...form, enable_personalization: e.target.checked })} className="rounded text-[#1933C6] w-4 h-4" />
                        <span>Enable Personalization (Cakes / Custom Mugs / Names)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={form.enable_wrapping !== false} onChange={e => setForm({ ...form, enable_wrapping: e.target.checked })} className="rounded text-[#1933C6] w-4 h-4" />
                        <span>Enable Gift Wrapping</span>
                    </label>
                </div>

                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Available Addon Items (Configured in Settings)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableAddons.map(addon => (
                            <label key={addon.id} className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 cursor-pointer">
                                <input type="checkbox" checked={addons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} className="rounded text-[#1933C6] w-3.5 h-3.5" />
                                <span>{addon.icon || '🎁'} {addon.name} (+Rs. {Number(addon.price).toLocaleString()})</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Suitable Occasions</label>
                    <div className="flex flex-wrap gap-2">
                        {occasionsList.map(occ => (
                            <button key={occ.id} type="button" onClick={() => toggleOccasion(occ.slug)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${occasions.includes(occ.slug) ? 'bg-[#1933C6] text-white border-[#1933C6]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                                {occ.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
