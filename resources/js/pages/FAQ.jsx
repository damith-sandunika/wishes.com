import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, HelpCircle, Phone, MessageCircle } from 'lucide-react';

const FAQS = [
    {
        q: 'Do you offer same-day delivery in Colombo and suburbs?',
        a: 'Yes! We offer same-day delivery across Colombo 1-15 and immediate suburbs (Dehiwala, Nugegoda, Rajagiriya, Battaramulla, Mount Lavinia, etc.) for orders placed before 12:00 PM.'
    },
    {
        q: 'Can I choose a specific delivery date and time slot?',
        a: 'Absolutely. During checkout, you can select your preferred delivery date (up to 30 days in advance) as well as a convenient time slot: Morning (10 AM - 1 PM), Afternoon (1 PM - 4 PM), or Evening (4 PM - 7 PM).'
    },
    {
        q: 'How does personalization work for mugs, frames, and greeting cards?',
        a: 'When you select any personalized gift item, text input boxes appear directly on the product page where you can specify recipient names, custom quotes, or greeting card wishes. If your item requires a photo, our customer service team will reach out via WhatsApp immediately after order placement.'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, MasterCard, and American Express online, local bank transfers, and Cash on Delivery (COD) for eligible gift items and delivery zones.'
    },
    {
        q: 'Are the flowers delivered fresh?',
        a: 'Yes, 100%! All our floral bouquets and arrangements are freshly sourced on the day of delivery from local growers and arranged in temperature-controlled preparation rooms with water packs to preserve peak freshness.'
    },
];

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-1.5 bg-rose-50 text-brand text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 border border-rose-100">
                        <HelpCircle size={14} /> Help &amp; Support
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm">
                        Got questions about gift orders, delivery times or custom items? We're here to help!
                    </p>
                </div>

                <div className="space-y-3 mb-12">
                    {FAQS.map((faq, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
                        >
                            <button 
                                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-gray-800 text-sm md:text-base hover:text-brand"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown 
                                    size={18} 
                                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180 text-brand' : ''}`} 
                                />
                            </button>
                            {openIdx === idx && (
                                <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Banner */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-6 md:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
                    <div>
                        <h4 className="font-bold text-lg mb-1">Still have questions?</h4>
                        <p className="text-xs text-rose-100">Chat with our dedicated support team on WhatsApp for instant assistance.</p>
                    </div>
                    <a 
                        href="https://wa.me/94718080582" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-brand px-6 py-3 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors shadow"
                    >
                        <MessageCircle size={16} /> WhatsApp Us Now
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
