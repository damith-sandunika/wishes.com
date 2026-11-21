import React, { useState, useEffect, useMemo } from 'react';
import { Gift, Check } from 'lucide-react';
import axios from 'axios';

export default function ProductAddons({ allowedAddons = [], onAddonsChange }) {
    const [dbAddons, setDbAddons] = useState([]);
    const [selected, setSelected] = useState({});

    useEffect(() => {
        axios.get('/api/public/addons')
            .then(res => setDbAddons(Array.isArray(res.data) ? res.data : []))
            .catch(() => setDbAddons([]));
    }, []);

    const available = useMemo(() => {
        if (Array.isArray(allowedAddons) && allowedAddons.length > 0) {
            return allowedAddons.map(item => {
                if (typeof item === 'object' && item !== null) {
                    const dbMatch = dbAddons.find(d => d.id === item.id);
                    return {
                        id: item.id,
                        name: item.name || dbMatch?.name || 'Add-on',
                        price: item.custom_price !== null && item.custom_price !== undefined ? Number(item.custom_price) : Number(item.price || dbMatch?.price || 0),
                        image: item.image || dbMatch?.image || '',
                        icon: item.icon || dbMatch?.icon || '🎁',
                        type: item.type || dbMatch?.type || 'addon',
                        description: item.description || dbMatch?.description || '',
                    };
                } else {
                    const dbMatch = dbAddons.find(d => d.id === item || d.name === item);
                    return dbMatch || null;
                }
            }).filter(Boolean);
        }
        return dbAddons;
    }, [allowedAddons, dbAddons]);

    if (available.length === 0) return null;

    const toggle = (addon) => {
        const next = { ...selected, [addon.id]: !selected[addon.id] };
        setSelected(next);
        if (onAddonsChange) {
            const chosen = available.filter(a => next[a.id]);
            onAddonsChange(chosen);
        }
    };

    return (
        <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100/80 my-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#c8102e]/10 text-[#c8102e]">
                        <Gift size={16} />
                    </span>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xs tracking-tight">Add-ons &amp; Personalizations</h4>
                        <p className="text-[10px] text-slate-500">Make this gift extra special with heartfelt additions</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {available.map(addon => {
                    const isChecked = Boolean(selected[addon.id]);
                    return (
                        <div 
                            key={addon.id}
                            onClick={() => toggle(addon)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                                isChecked 
                                ? 'bg-white border-[#c8102e] shadow-xs ring-1 ring-[#c8102e]/20' 
                                : 'bg-white/90 border-slate-200/90 hover:border-rose-300 hover:bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/70 flex items-center justify-center">
                                    {addon.image ? (
                                        <img src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl">{addon.icon || '🎁'}</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">{addon.name}</p>
                                    <p className="text-[11px] text-[#c8102e] font-extrabold mt-0.5">
                                        + Rs. {Number(addon.price || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className={`w-5 h-5 ml-2 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                                isChecked ? 'bg-[#c8102e] border-[#c8102e] text-white shadow-2xs' : 'border-slate-300 bg-white'
                            }`}>
                                {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
