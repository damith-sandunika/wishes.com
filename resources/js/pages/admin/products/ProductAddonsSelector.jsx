import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Check, DollarSign } from 'lucide-react';
import axios from 'axios';

export default function ProductAddonsSelector({ form, setForm }) {
    const [allAddons, setAllAddons] = useState([]);
    const [loading, setLoading] = useState(true);

    const allowed = Array.isArray(form.allowed_addons) ? form.allowed_addons : [];

    useEffect(() => {
        axios.get('/api/public/addons')
            .then(res => setAllAddons(Array.isArray(res.data) ? res.data : []))
            .catch(() => setAllAddons([]))
            .finally(() => setLoading(false));
    }, []);

    const findItem = (addonId) => {
        return allowed.find(a => (typeof a === 'object' ? a.id === addonId : a === addonId));
    };

    const toggleAddon = (addon) => {
        const exists = findItem(addon.id);
        let next;
        if (exists) {
            next = allowed.filter(a => (typeof a === 'object' ? a.id !== addon.id : a !== addon.id));
        } else {
            next = [
                ...allowed,
                {
                    id: addon.id,
                    name: addon.name,
                    price: Number(addon.price || 0),
                    custom_price: null,
                    is_price_editable: Boolean(addon.is_price_editable),
                    image: addon.image || '',
                    icon: addon.icon || '🎁',
                    type: addon.type || 'addon',
                }
            ];
        }
        setForm({ ...form, allowed_addons: next });
    };

    const updateCustomPrice = (addonId, newPrice) => {
        const next = allowed.map(a => {
            const currentId = typeof a === 'object' ? a.id : a;
            if (currentId === addonId) {
                const base = typeof a === 'object' ? a : { id: addonId };
                const num = newPrice === '' ? '' : Number(newPrice);
                return { ...base, custom_price: num, price: num !== '' && !isNaN(num) ? num : base.price };
            }
            return a;
        });
        setForm({ ...form, allowed_addons: next });
    };

    if (loading) return <div className="text-xs text-slate-400 py-3">Loading available add-ons...</div>;
    if (allAddons.length === 0) return <div className="text-xs text-slate-400 py-2">No add-ons created in Admin yet. Create some under "Personalization & Addons".</div>;

    return (
        <div className="space-y-2.5">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">
                Available Add-ons &amp; Personalizations (Select to attach to this product)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allAddons.map(addon => {
                    const selected = findItem(addon.id);
                    const isChecked = Boolean(selected);
                    const currentPrice = typeof selected === 'object' && selected?.custom_price !== null && selected?.custom_price !== undefined
                        ? selected.custom_price
                        : addon.price;

                    return (
                        <div key={addon.id}
                            className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                                isChecked ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-100 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                        >
                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleAddon(addon)}
                                    className="mt-1 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer shrink-0"
                                />

                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                    {(addon.image || addon.options?.[0]?.image) ? (
                                        <img src={addon.image || addon.options?.[0]?.image} alt={addon.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl">{addon.icon || '🎁'}</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-xs font-bold text-slate-800 leading-tight">{addon.name}</span>
                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                                            addon.type === 'personalization' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {addon.type === 'personalization' ? 'Personalize' : 'Addon'}
                                        </span>
                                        {Array.isArray(addon.options) && addon.options.length > 0 && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                                {addon.options.length} style{addon.options.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{addon.description || 'No description'}</p>
                                    <p className="text-[11px] font-semibold text-slate-600 mt-1">
                                        Default: <span className="text-blue-700 font-bold">Rs. {Number(addon.price || 0).toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Price Configuration per Product */}
                            {isChecked && (
                                <div className="mt-2.5 pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
                                    {addon.is_price_editable ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">Product Price:</span>
                                            <div className="flex items-center border border-blue-300 rounded-md bg-white overflow-hidden flex-1 max-w-[140px]">
                                                <span className="px-1.5 py-1 text-[10px] bg-slate-50 text-slate-500 border-r border-slate-200 font-semibold">Rs</span>
                                                <input
                                                    type="number"
                                                    value={currentPrice ?? ''}
                                                    onChange={e => updateCustomPrice(addon.id, e.target.value)}
                                                    placeholder={String(addon.price)}
                                                    className="w-full text-xs px-2 py-1 outline-none text-slate-800 font-bold"
                                                />
                                            </div>
                                            <span className="text-[9px] text-emerald-600 font-semibold">(Editable)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-[10px] text-slate-500 font-medium">Pricing policy:</span>
                                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                                Fixed: Rs. {Number(addon.price).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
