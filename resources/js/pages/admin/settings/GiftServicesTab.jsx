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

    const toggleWrap = (id) => {
        updateWraps(wrappings.map(w => w.id === id ? { ...w, active: !w.active } : w));
    };

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

    const toggleAddon = (id) => {
        updateAddons(addons.map(a => a.id === id ? { ...a, active: !a.active } : a));
    };

    const deleteAddon = (id) => {
        if (!confirm('Delete this gift add-on item?')) return;
        updateAddons(addons.filter(a => a.id !== id));
    };

    const inp = "px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#1933C6] outline-none";

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Wrapping Section */}
            <div className="p-5 bg-rose-50/40 rounded-xl border border-rose-100">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-200/50">
                    <div className="flex items-center gap-2">
                        <Gift size={18} className="text-[#c8102e]" />
                        <h3 className="font-bold text-gray-800 text-sm">Gift Wrapping Options</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{wrappings.length} Styles</span>
                </div>

                <form onSubmit={addWrapping} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                    <input type="text" placeholder="Wrap Name (e.g. Royal Gold)" value={wrapName} onChange={e => setWrapName(e.target.value)} className={inp} />
                    <div className="flex items-center gap-2">
                        <input type="color" value={wrapColor} onChange={e => setWrapColor(e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                        <input type="text" value={wrapColor} onChange={e => setWrapColor(e.target.value)} className={`${inp} flex-1`} />
                    </div>
                    <input type="number" placeholder="Extra Price (0 = Free)" value={wrapPrice} onChange={e => setWrapPrice(e.target.value)} className={inp} />
                    <button type="submit" className="bg-[#1933C6] hover:bg-[#090087] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition">
                        <Plus size={14} /> Add Style
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {wrappings.map(w => (
                        <div key={w.id} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-6 h-6 rounded-full border border-gray-300 shrink-0 shadow-xs" style={{ backgroundColor: w.code }} />
                                <div className="truncate">
                                    <p className="text-xs font-bold text-gray-800 truncate">{w.name}</p>
                                    <p className="text-[11px] font-semibold text-emerald-600">{Number(w.price) > 0 ? `+Rs. ${Number(w.price).toLocaleString()}` : 'Free'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => toggleWrap(w.id)} className={`p-1 rounded-md transition ${w.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`} title={w.active ? 'Active' : 'Inactive'}>
                                    {w.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                </button>
                                <button type="button" onClick={() => deleteWrap(w.id)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition" title="Delete">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Addons Section */}
            <div className="p-5 bg-blue-50/40 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-blue-200/50">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-[#1933C6]" />
                        <h3 className="font-bold text-gray-800 text-sm">Extra Gift Add-ons (Upsells)</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{addons.length} Add-ons</span>
                </div>

                <form onSubmit={addAddon} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
                    <input type="text" placeholder="Add-on Name (e.g. Teddy Bear)" value={addonName} onChange={e => setAddonName(e.target.value)} className={inp} />
                    <input type="text" placeholder="Icon / Emoji (e.g. 🧸, 💌)" value={addonIcon} onChange={e => setAddonIcon(e.target.value)} className={inp} />
                    <input type="number" placeholder="Price (Rs.)" value={addonPrice} onChange={e => setAddonPrice(e.target.value)} className={inp} />
                    <button type="submit" className="bg-[#1933C6] hover:bg-[#090087] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition">
                        <Plus size={14} /> Add Item
                    </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {addons.map(a => (
                        <div key={a.id} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-xl shrink-0">{a.icon}</span>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-gray-800 truncate">{a.name}</p>
                                    <p className="text-[11px] font-semibold text-[#c8102e]">+Rs. {Number(a.price).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => toggleAddon(a.id)} className={`p-1 rounded-md transition ${a.active ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-300 hover:bg-gray-100'}`} title={a.active ? 'Active' : 'Inactive'}>
                                    {a.active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                </button>
                                <button type="button" onClick={() => deleteAddon(a.id)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition" title="Delete">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
