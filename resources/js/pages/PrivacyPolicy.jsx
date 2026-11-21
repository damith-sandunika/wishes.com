import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const DEFAULT_SECTIONS = [
    {
        title: '1. Information We Collect',
        content: 'We collect your contact details (name, email, phone number) and recipient details (name, address, delivery instructions) solely for executing the order delivery and communication.'
    },
    {
        title: '2. Payment Security',
        content: 'We do not store credit or debit card numbers on our servers. All online transactions are processed through bank-grade encrypted payment gateways with 3D Secure verification.'
    },
    {
        title: '3. Confidentiality of Gift Messages',
        content: 'Personal greeting card messages and custom photos shared for customization are strictly confidential and deleted after order completion.'
    }
];

export default function PrivacyPolicy() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    useEffect(() => {
        axios.get('/api/public/settings')
            .then(res => {
                const raw = res.data?.policy_privacy;
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
                title="Privacy &amp; Data Security"
                subtitle="How we protect your personal, recipient and confidential payment details."
                badge="100% Confidential"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Privacy Policy' }
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
