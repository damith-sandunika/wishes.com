import React from 'react';
import { Truck, Shield, Package, Award } from 'lucide-react';

const TRUST_BADGES = [
    { icon: Truck, label: 'Islandwide Delivery', sub: 'Scheduled & express slots available' },
    { icon: Shield, label: 'Secure Checkout', sub: 'Bank transfer & Card payments' },
    { icon: Package, label: 'Signature Packaging', sub: 'Protective gift wraps & boxes' },
    { icon: Award, label: 'Quality Guarantee', sub: 'Handcrafted fresh for every order' },
];

export default function ProductTrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center gap-3 shadow-2xs">
                    <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 text-[#c8102e]">
                        <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight truncate">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
