import React from 'react';

export default function AdminStatCard({ label, value, icon: Icon, color = 'blue', subtext }) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="p-4 md:p-5 flex items-center gap-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 rounded-xl ${colorMap[color] || colorMap.blue} flex items-center justify-center border shrink-0`}>
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider leading-none mb-1.5 truncate">
                    {label}
                </p>
                <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none truncate">
                    {value}
                </h4>
                {subtext && (
                    <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
}
