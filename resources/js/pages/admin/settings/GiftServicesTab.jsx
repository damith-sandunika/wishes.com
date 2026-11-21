import React, { useState } from 'react';
import { Gift, Plus, Trash2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function GiftServicesTab({ settings, handleChange }) {
    const parseList = (val, fallback = []) => {
        try { return typeof val === 'string' ? JSON.parse(val) : (Array.isArray(val) ? val : fallback); }
        catch { return fallback; }
    };

    const wrappings = parseList(settings.gift_wrapping_options, []);
    const addons = parseList(settings.gift_addons_options, []);

    const [wrapName, setWrapName] = useState('');
    const [wrapColor, setWrapColor] = useState('#8b5cf6');
    const [wrapPrice, setWrapPrice] = useState('0');

    const [addonName, setAddonName] = useState('');
    const [addonPrice, setAddonPrice] = useState('350');
    const [addonIcon, setAddonIcon] = useState('🎁');

    const updateWraps = (next) => handleChange('gift_wrapping_options', JSON.stringify(next));
    const updateAddons = (next) => handleChange('gift_addons_options', JSON.stringify(next));

    const addWrapping = (e) => {
        e.preventDefault();
        if (!wrapName.trim()) return;
        const next = [...wrappings, { id: 'wrap_' + Date.now(), name: wrapName, code: wrapColor, price: Number(wrapPrice || 0), active: true }];
        updateWraps(next);
        setWrapName('');
        setWrapPrice('0');
    };

    const toggleWrap = (id) => updateWraps(wrappings.map(w => w.id === id ? { ...w, active: !w.active } : w));
    const deleteWrap = (id) => {
        if (!confirm('Delete this gift wrapping option?')) return;
        updateWraps(wrappings.filter(w => w.id !== id));
    };

    const addAddon = (e) => {
        e.preventDefault();
        if (!addonName.trim()) return;
        const next = [...addons, { id: 'ad_' + Date.now(), name: addonName, price: Number(addonPrice || 0), icon: addonIcon || '🎁', active: true }];
        updateAddons(next);
        setAddonName('');
        setAddonPrice('350');
    };

    const toggleAddon = (id) => updateAddons(addons.map(a => a.id === id ? { ...a, active: !a.active } : a));
    const deleteAddon = (id) => {
        if (!confirm('Delete this gift add-on item?')) return;
        updateAddons(addons.filter(a => a.id !== id));
    };

    const inp = "px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none";

    return (
        <div className="space-y-6">
            <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200/50">
                    <div className="flex items-center gap-2">
                        <Gift size={16} className="text-rose-600" />
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Gift Wrapping Options</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">{wrappings.length} Styles</span>
                </div>

                <form onSubmit={addWrapping} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 bg-white p-3 rounded-lg border border-slate-200">
                    <input type="text" placeholder="Wrap Name (e.g. Royal Gold)" value={wrapName} onChange={e => setWrapName(e.target.value)} className={inp} />
                    <div className="flex items-center gap-2">
                        <input type="color" value={wrapColor} onChange={e => setWrapColor(e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                        <input type="text" value={wrapColor} onChange={e => setWrapColor(e.target.value)} className={`${inp} flex-1`} />
                    </div>
                    <input type="number" placeholder="Extra Price (0 = Free)" value={wrapPrice} onChange={e => setWrapPrice(e.target.value)} className={inp} />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition">
                        <Plus size={14} /> Add Style
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {wrappings.map(w => (
                        <div key={w.id} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: w.code }} />
                                <div className="truncate">
                                    <p className="text-xs font-bold text-slate-800 truncate">{w.name}</p>
                                    <p className="text-[10px] font-semibold text-emerald-600">{Number(w.price) > 0 ? `+Rs. ${Number(w.price).toLocaleString()}` : 'Free'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => toggleWrap(w.id)} className={`p-1 rounded ${w.active ? 'text-emerald-600' : 'text-slate-300'}`}>
                                    {w.active ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                                </button>
                                <button type="button" onClick={() => deleteWrap(w.id)} className="p-1 text-rose-500 hover:text-rose-700">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-200/50">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-600" />
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Gift Add-ons (Upsells)</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">{addons.length} Add-ons</span>
                </div>

                <form onSubmit={addAddon} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 bg-white p-3 rounded-lg border border-slate-200">
                    <input type="text" placeholder="Add-on Name (e.g. Teddy Bear)" value={addonName} onChange={e => setAddonName(e.target.value)} className={inp} />
                    <input type="text" placeholder="Icon / Emoji (e.g. 🧸)" value={addonIcon} onChange={e => setAddonIcon(e.target.value)} className={inp} />
                    <input type="number" placeholder="Price (Rs.)" value={addonPrice} onChange={e => setAddonPrice(e.target.value)} className={inp} />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition">
                        <Plus size={14} /> Add Item
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {addons.map(a => (
                        <div key={a.id} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg shrink-0">{a.icon}</span>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-slate-800 truncate">{a.name}</p>
                                    <p className="text-[10px] font-semibold text-rose-600">+Rs. {Number(a.price).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => toggleAddon(a.id)} className={`p-1 rounded ${a.active ? 'text-emerald-600' : 'text-slate-300'}`}>
                                    {a.active ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                                </button>
                                <button type="button" onClick={() => deleteAddon(a.id)} className="p-1 text-rose-500 hover:text-rose-700">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
