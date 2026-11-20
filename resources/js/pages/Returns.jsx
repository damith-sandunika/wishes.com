import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RotateCcw, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function Returns() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-rose-50 text-brand px-3.5 py-1.5 rounded-full mb-3 border border-rose-100">
                        <RotateCcw size={13} /> 100% Satisfaction Guarantee
                    </span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Returns &amp; Refunds Policy</h1>
                    <p className="text-xs md:text-sm text-gray-500">Your happiness is our highest priority.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">1. Freshness &amp; Quality Guarantee</h4>
                        <p>If any fresh flowers or perishable items arrive damaged or sub-standard, please notify us within <strong>24 hours</strong> of delivery along with a photo. We will immediately dispatch a fresh replacement or issue a full refund with no hassle.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">2. Personalized Items</h4>
                        <p>Custom-printed mugs, engraved acrylic frames, and personalized greeting cards cannot be returned unless there was an error in printing on our side, in which case we will reprint and deliver at zero additional cost.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">3. Refund Processing</h4>
                        <p>Approved refunds are credited back to the original payment method (Credit/Debit Card or Bank Transfer) within <strong>3-5 business days</strong>.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
