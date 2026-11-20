import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy &amp; Data Security</h1>
                    <p className="text-xs text-gray-500">How we protect your personal and recipient details.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">1. Information We Collect</h4>
                        <p>We collect your contact details (name, email, phone number) and recipient details (name, address, delivery instructions) solely for executing the order delivery and communication.</p>
                    </section>
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">2. Payment Security</h4>
                        <p>We do not store credit or debit card numbers on our servers. All online transactions are processed through bank-grade encrypted payment gateways with 3D Secure verification.</p>
                    </section>
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">3. Confidentiality of Gift Messages</h4>
                        <p>Personal greeting card messages and custom photos shared for customization are strictly confidential and deleted after order completion.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
