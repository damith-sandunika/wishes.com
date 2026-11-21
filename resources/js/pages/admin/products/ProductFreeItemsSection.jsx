import React, { useState, useEffect } from 'react';
import { Award, Check } from 'lucide-react';
import axios from 'axios';

export default function ProductFreeItemsSection({ form, setForm }) {
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const selected = Array.isArray(form.free_items) ? form.free_items : [];

    useEffect(() => {
        axios.get('/api/free-items')
            .then(res => setAllItems(Array.isArray(res.data) ? res.data : []))
            .catch(() => setAllItems([]))
            .finally(() => setLoading(false));
    }, []);

    const isSelected = (itemId) => {
        return selected.some(item => (typeof item === 'object' ? item.id === itemId : item === itemId));
    };

    const toggle = (freeItem) => {
        let next;
        if (isSelected(freeItem.id)) {
            next = selected.filter(item => (typeof item === 'object' ? item.id !== freeItem.id : item !== freeItem.id));
        } else {
            next = [...selected, { id: freeItem.id, name: freeItem.name, image: freeItem.image, description: freeItem.description }];
        }
        setForm({ ...form, free_items: next });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Award size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">6. Complimentary Free Items</h3>
                    <p className="text-[11px] text-slate-500">Select free items included with this product (e.g. Free Wish Card, Free Red Ribbon, Free Brooch).</p>
                </div>
            </div>

            {loading ? (
                <div className="text-xs text-slate-400 py-3">Loading available free items...</div>
            ) : allItems.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                    No free items created yet. You can create free items under the "Free Items" admin menu.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {allItems.map(item => {
                        const active = isSelected(item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => toggle(item)}
                                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                    active
                                        ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-200 shadow-2xs'
                                        : 'bg-white border-slate-200 hover:border-emerald-300'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Award size={22} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs font-bold text-slate-800 truncate block leading-tight">{item.name}</span>
                                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">FREE</span>
                                        </div>
                                        {item.description && (
                                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                                    active ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs' : 'border-slate-300 bg-white'
                                }`}>
                                    {active && <Check size={12} strokeWidth={3} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
