import React, { useState, useEffect, useMemo } from 'react';
import { Gift, Check } from 'lucide-react';
import axios from 'axios';

export default function ProductAddons({ allowedAddons = [], onAddonsChange }) {
    const [dbAddons, setDbAddons] = useState([]);
    const [selected, setSelected] = useState({});
    const [chosenOptions, setChosenOptions] = useState({});
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        axios.get('/api/public/addons')
            .then(res => setDbAddons(Array.isArray(res.data) ? res.data : []))
            .catch(() => setDbAddons([]));
    }, []);

    const available = useMemo(() => {
        const raw = (Array.isArray(allowedAddons) && allowedAddons.length > 0)
            ? allowedAddons.map(item => {
                const id = typeof item === 'object' && item !== null ? item.id : item;
                const dbMatch = dbAddons.find(d => d.id === id || d.name === item);
                if (!dbMatch && typeof item !== 'object') return null;

                const basePrice = item.custom_price !== null && item.custom_price !== undefined
                    ? Number(item.custom_price)
                    : Number(item?.price || dbMatch?.price || 0);

                return {
                    id: id,
                    name: item?.name || dbMatch?.name || 'Add-on',
                    price: basePrice,
                    image: item?.image || dbMatch?.image || '',
                    icon: item?.icon || dbMatch?.icon || '🎁',
                    type: item?.type || dbMatch?.type || 'addon',
                    description: item?.description || dbMatch?.description || '',
                    options: Array.isArray(dbMatch?.options) ? dbMatch.options : (Array.isArray(item?.options) ? item.options : []),
                    custom_fields: Array.isArray(dbMatch?.custom_fields) ? dbMatch.custom_fields : (Array.isArray(item?.custom_fields) ? item.custom_fields : []),
                };
            }).filter(Boolean)
            : dbAddons.map(d => ({
                ...d,
                price: Number(d.price || 0),
                options: Array.isArray(d.options) ? d.options : [],
                custom_fields: Array.isArray(d.custom_fields) ? d.custom_fields : [],
            }));

        // Strictly show only non-personalized Addons in this inline section
        return raw.filter(a => (a.type || 'addon') !== 'personalization');
    }, [allowedAddons, dbAddons]);

    const notifyChange = (nextSelected, nextOptions, nextInputs) => {
        if (!onAddonsChange) return;
        const chosen = available.filter(a => nextSelected[a.id]).map(a => {
            const opt = nextOptions[a.id] || (a.options?.[0] || null);
            const effPrice = opt?.price !== undefined && opt?.price !== '' ? Number(opt.price) : a.price;
            return {
                ...a,
                price: effPrice,
                selected_option: opt,
                image: opt?.image || a.image,
                custom_inputs: nextInputs[a.id] || {},
            };
        });
        onAddonsChange(chosen);
    };

    const toggle = (addon) => {
        const next = { ...selected, [addon.id]: !selected[addon.id] };
        const nextOpts = { ...chosenOptions };
        if (next[addon.id] && addon.options?.length > 0 && !nextOpts[addon.id]) {
            nextOpts[addon.id] = addon.options[0];
        }
        setSelected(next);
        setChosenOptions(nextOpts);
        notifyChange(next, nextOpts, inputs);
    };

    const handleOptionSelect = (addonId, opt) => {
        const nextOpts = { ...chosenOptions, [addonId]: opt };
        setChosenOptions(nextOpts);
        notifyChange(selected, nextOpts, inputs);
    };

    const handleInputChange = (addonId, label, val) => {
        const nextInputs = { ...inputs, [addonId]: { ...(inputs[addonId] || {}), [label]: val } };
        setInputs(nextInputs);
        notifyChange(selected, chosenOptions, nextInputs);
    };

    if (available.length === 0) return null;

    return (
        <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100/90 my-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-600/10 text-blue-700"><Gift size={16} /></span>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xs tracking-tight">Available Add-ons</h4>
                        <p className="text-[10px] text-slate-500">Chocolates, plushies, candles &amp; signature ribbons</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100/70 px-2 py-0.5 rounded-full">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {available.map(addon => {
                    const isChecked = Boolean(selected[addon.id]);
                    const currentOpt = chosenOptions[addon.id] || addon.options?.[0];
                    const displayPrice = isChecked && currentOpt?.price !== undefined && currentOpt?.price !== '' ? Number(currentOpt.price) : addon.price;
                    const activeThumb = currentOpt?.image || addon.options?.[0]?.image || addon.image;

                    return (
                        <div key={addon.id} className={`rounded-xl border transition-all ${isChecked ? 'bg-white border-blue-600 shadow-xs ring-1 ring-blue-600/20' : 'bg-white/90 border-slate-200 hover:border-blue-300'}`}>
                            <div onClick={() => toggle(addon)} className="flex items-center justify-between p-2.5 cursor-pointer">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-11 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/70 flex items-center justify-center">
                                        {activeThumb ? <img src={activeThumb} alt={addon.name} className="w-full h-full object-cover transition-all" /> : <span className="text-xl">{addon.icon || '🎁'}</span>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-800 truncate leading-tight">{addon.name}</p>
                                        <p className="text-[11px] text-blue-700 font-extrabold mt-0.5">
                                            {Number(displayPrice) > 0 ? `+ Rs. ${Number(displayPrice).toLocaleString()}` : 'Free'}
                                        </p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 ml-2 rounded-md flex items-center justify-center border shrink-0 ${isChecked ? 'bg-blue-600 border-blue-600 text-white shadow-2xs' : 'border-slate-300 bg-white'}`}>
                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                </div>
                            </div>

                            {isChecked && (addon.options?.length > 0 || addon.custom_fields?.length > 0) && (
                                <div className="p-3 pt-2 border-t border-blue-100 bg-blue-50/30 space-y-2.5 text-xs">
                                    {addon.options?.length > 0 && (
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Select Option:</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {addon.options.map((opt, i) => {
                                                    const isOptActive = (currentOpt?.name === opt.name) || (!chosenOptions[addon.id] && i === 0);
                                                    return (
                                                        <button key={i} type="button" onClick={() => handleOptionSelect(addon.id, opt)}
                                                            className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition flex items-center gap-1.5 ${isOptActive ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                                                            {opt.image && <img src={opt.image} alt={opt.name} className="w-4 h-4 rounded-sm object-cover border border-white/50" />}
                                                            <span>{opt.name}</span>
                                                            {opt.price ? <span className="opacity-80 font-normal">({Number(opt.price) > 0 ? `+Rs. ${Number(opt.price).toLocaleString()}` : 'Free'})</span> : null}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {addon.custom_fields?.map((fld, idx) => (
                                        <div key={idx}>
                                            <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                                                {fld.label} {fld.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type={fld.type === 'number' ? 'number' : 'text'}
                                                value={inputs[addon.id]?.[fld.label] || ''}
                                                onChange={e => handleInputChange(addon.id, fld.label, e.target.value)}
                                                placeholder={fld.placeholder || `Enter ${fld.label}`}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
