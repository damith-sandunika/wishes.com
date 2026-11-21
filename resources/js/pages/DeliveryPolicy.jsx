import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { Clock, MapPin } from 'lucide-react';

const DEFAULT_HIGHLIGHTS = [
    { title: 'Same Day Delivery', desc: 'Available for Colombo 1-15 & Greater Colombo for orders placed before 12:00 PM noon.' },
    { title: 'Islandwide Delivery', desc: 'Delivered within 1 to 2 working days via our reliable courier partners with live tracking.' }
];

const DEFAULT_SECTIONS = [
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

export default function DeliveryPolicy() {
    const [highlights, setHighlights] = useState(DEFAULT_HIGHLIGHTS);
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    useEffect(() => {
        axios.get('/api/public/settings')
            .then(res => {
                const rawSec = res.data?.policy_delivery;
                if (rawSec) {
                    try {
                        const parsed = typeof rawSec === 'string' ? JSON.parse(rawSec) : rawSec;
                        if (Array.isArray(parsed) && parsed.length > 0) setSections(parsed);
                    } catch (_) {}
                }
                const rawHigh = res.data?.policy_delivery_highlights;
                if (rawHigh) {
                    try {
                        const parsedHigh = typeof rawHigh === 'string' ? JSON.parse(rawHigh) : rawHigh;
                        if (Array.isArray(parsedHigh) && parsedHigh.length > 0) setHighlights(parsedHigh);
                    } catch (_) {}
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <PageHero
                title="Delivery &amp; Shipping Policy"
                subtitle="Fast, secure and temperature-controlled gift delivery across Sri Lanka."
                badge="White-Glove Courier"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Delivery Policy' }
                ]}
            />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {highlights.map((h, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-brand shrink-0">
                                {i === 0 ? <Clock size={20} /> : <MapPin size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{h.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                    {sections.map((sec, i) => (
                        <section key={i}>
                            <h4 className="font-bold text-gray-900 text-sm mb-2">{sec.title}</h4>
                            <p>{sec.content}</p>
                        </section>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
