import React from 'react';
import { Gift, Award } from 'lucide-react';

export default function ProductFreeItemsBanner({ items = [] }) {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/70 rounded-2xl p-3.5 border border-emerald-200/90 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                        <Gift size={14} />
                    </span>
                    <div>
                        <span className="text-xs font-bold text-emerald-950 block leading-tight">Free Gifts Included With This Item</span>
                        <span className="text-[10px] text-emerald-700/90">Included free of charge with your order</span>
                    </div>
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                    Free
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((fi, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-emerald-100/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50/50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                            {fi.image ? (
                                <img src={fi.image} alt={fi.name} className="w-full h-full object-cover" />
                            ) : (
                                <Award size={20} className="text-emerald-500" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-800 truncate block leading-tight">{fi.name}</span>
                            {fi.description ? (
                                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{fi.description}</p>
                            ) : (
                                <span className="text-[10px] text-emerald-600 font-semibold">Complimentary gift</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
