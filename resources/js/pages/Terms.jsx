import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms &amp; Conditions</h1>
                    <p className="text-xs text-gray-500">Last updated: November 2026</p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">1. Agreement to Terms</h4>
                        <p>By accessing or purchasing from Wishes.com, you agree to be bound by these Terms and our Delivery &amp; Refund Policies.</p>
                    </section>
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">2. Product Availability &amp; Substitution</h4>
                        <p>Due to seasonal flower blooms and artisan handcrafted items, minor variations in shade or basket styles may occur. We guarantee any substitution will always be of equal or greater value and beauty.</p>
                    </section>
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">3. Pricing &amp; Currency</h4>
                        <p>All prices listed on Wishes.com are in Sri Lankan Rupees (LKR) and include applicable packaging taxes.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
