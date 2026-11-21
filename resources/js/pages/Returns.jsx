import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const DEFAULT_SECTIONS = [
    {
        title: '1. Freshness & Quality Guarantee',
        content: 'If any fresh flowers or perishable items arrive damaged or sub-standard, please notify us within 24 hours of delivery along with a photo. We will immediately dispatch a fresh replacement or issue a full refund with no hassle.'
    },
    {
        title: '2. Personalized Items',
        content: 'Custom-printed mugs, engraved acrylic frames, and personalized greeting cards cannot be returned unless there was an error in printing on our side, in which case we will reprint and deliver at zero additional cost.'
    },
    {
        title: '3. Refund Processing',
        content: 'Approved refunds are credited back to the original payment method (Credit/Debit Card or Bank Transfer) within 3-5 business days.'
    }
];

export default function Returns() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    useEffect(() => {
        axios.get('/api/public/settings')
            .then(res => {
                const raw = res.data?.policy_returns;
                if (raw) {
                    try {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        if (Array.isArray(parsed) && parsed.length > 0) setSections(parsed);
                    } catch (_) {}
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <PageHero
                title="Returns &amp; Refunds Policy"
                subtitle="Your complete happiness is our highest priority with our 100% satisfaction promise."
                badge="Satisfaction Guarantee"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Returns' }
                ]}
            />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
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
