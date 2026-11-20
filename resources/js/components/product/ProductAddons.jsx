import React, { useState, useMemo } from 'react';
import { Gift, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const DEFAULT_ADDONS = [
    { id: 'card', name: 'Handwritten Greeting Card', price: 350, icon: '💌' },
    { id: 'teddy', name: 'Mini Cuddle Teddy Bear', price: 1500, icon: '🧸' },
    { id: 'ferrero', name: 'Ferrero Rocher Box (3 pcs)', price: 950, icon: '🍫' },
    { id: 'candle', name: 'Scented Vanilla Candle', price: 1200, icon: '🕯️' },
    { id: 'lights', name: 'Warm LED Fairy Lights', price: 650, icon: '✨' },
];

export default function ProductAddons({ allowedAddons = [], onAddonsChange }) {
    const { settings } = useSettings();
    const [selected, setSelected] = useState({});

    const allAddons = useMemo(() => {
        if (settings?.gift_addons_options) {
            try {
                const parsed = typeof settings.gift_addons_options === 'string'
                    ? JSON.parse(settings.gift_addons_options) : settings.gift_addons_options;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.filter(a => a.active !== false);
                }
            } catch {}
        }
        return DEFAULT_ADDONS;
    }, [settings?.gift_addons_options]);

    const available = allAddons.filter(a => {
        if (!allowedAddons || allowedAddons.length === 0) return true;
        return allowedAddons.includes(a.id) || allowedAddons.includes(a.name);
    });

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
        <div className="bg-rose-50/40 rounded-2xl p-5 border border-rose-100 my-6">
            <div className="flex items-center gap-2 mb-3">
                <Gift size={16} className="text-[#c8102e]" />
                <h4 className="font-bold text-gray-900 text-xs md:text-sm">Complete Your Gift (Optional Add-ons)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {available.map(addon => {
                    const isChecked = !!selected[addon.id];
                    return (
                        <div 
                            key={addon.id}
                            onClick={() => toggle(addon)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                isChecked 
                                ? 'bg-white border-[#c8102e] shadow-sm' 
                                : 'bg-white/80 border-gray-200 hover:border-rose-200'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-lg">{addon.icon || '🎁'}</span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800 leading-tight">{addon.name}</p>
                                    <p className="text-[11px] text-[#c8102e] font-bold mt-0.5">+ Rs. {Number(addon.price).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                isChecked ? 'bg-[#c8102e] border-[#c8102e] text-white' : 'border-gray-300 bg-white'
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
