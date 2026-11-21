import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const DEFAULT_SECTIONS = [
    {
        title: '1. Agreement to Terms',
        content: 'By accessing or purchasing from Wishes.com, you agree to be bound by these Terms and our Delivery & Refund Policies.'
    },
    {
        title: '2. Product Availability & Substitution',
        content: 'Due to seasonal flower blooms and artisan handcrafted items, minor variations in shade or basket styles may occur. We guarantee any substitution will always be of equal or greater value and beauty.'
    },
    {
        title: '3. Pricing & Currency',
        content: 'All prices listed on Wishes.com are in Sri Lankan Rupees (LKR) and include applicable packaging taxes.'
    }
];

export default function Terms() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    useEffect(() => {
        axios.get('/api/public/settings')
            .then(res => {
                const raw = res.data?.policy_terms;
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
                title="Terms &amp; Conditions"
                subtitle="Legal guidelines and terms of service for purchases made on Wishes.com."
                badge="Legal Notice"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Terms' }
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
