import React, { useState, useEffect } from 'react';
import PolicyEditorLayout from './PolicyEditorLayout';
import axios from 'axios';
import { Truck, Clock, MapPin, Save } from 'lucide-react';

const DEFAULT_DELIVERY_SECTIONS = [
    {
        title: '1. Delivery Charges',
        content: 'Standard delivery charge across the island is LKR 350. Orders exceeding LKR 5,000 qualify for 100% Free Delivery. Same-day express priority delivery is available for LKR 750.'
    },
    {
        title: '2. Cake & Perishable Handling',
        content: 'Cakes and fresh floral bouquets are transported in dedicated refrigerated containers to preserve temperature and structural integrity during transit.'
    },
    {
        title: '3. Recipient Contact & Surprise Policy',
        content: 'If you prefer a complete surprise delivery, you can mention it during checkout. Our delivery rider will only contact the recipient upon arrival at the gate.'
    }
];

export default function DeliveryPolicySettings() {
    const [highlights, setHighlights] = useState([
        { title: 'Same Day Delivery', desc: 'Available for Colombo 1-15 & Greater Colombo for orders placed before 12:00 PM noon.' },
        { title: 'Islandwide Delivery', desc: 'Delivered within 1 to 2 working days via our reliable courier partners with live tracking.' }
    ]);

    useEffect(() => {
        axios.get('/api/settings').then(res => {
            const raw = res.data?.policy_delivery_highlights;
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (Array.isArray(parsed) && parsed.length > 0) setHighlights(parsed);
                } catch (_) {}
            }
        }).catch(() => {});
    }, []);

    const saveHighlights = async () => {
        try {
            await axios.post('/api/settings', { policy_delivery_highlights: highlights });
            alert('Delivery highlight banners saved!');
        } catch (_) {}
    };

    const inp = "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-600 font-semibold shadow-2xs";

    const extra = (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Truck size={16} /></span>
                    <h3 className="font-bold text-slate-800 text-xs">Top Highlight Banners (Displayed above policy text)</h3>
                </div>
                <button type="button" onClick={saveHighlights} className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">Save Banners</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((h, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
                        <input value={h.title || ''} onChange={e => setHighlights(highlights.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} className={`${inp} font-bold`} placeholder="Banner Title" />
                        <textarea rows={2} value={h.desc || ''} onChange={e => setHighlights(highlights.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x))} className={`${inp} resize-none font-normal`} placeholder="Banner Description" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <PolicyEditorLayout
            pageTitle="Delivery &amp; Shipping Policy"
            pageSubtitle="Configure dispatch rules, freshness protocols, and delivery charges displayed on wishes.com/delivery-policy."
            settingKey="policy_delivery"
            defaultSections={DEFAULT_DELIVERY_SECTIONS}
            extraContent={extra}
        />
    );
}
