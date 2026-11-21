import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

export default function OrderSuccessView({ onContinue }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-emerald-100 text-center max-w-md w-full">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">🎉 Order Placed Successfully!</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mb-8">
                        Thank you! We will reach out to you via WhatsApp shortly to coordinate delivery details.
                    </p>
                    <button
                        onClick={onContinue}
                        className="w-full py-3.5 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-bold rounded-xl transition-colors shadow-md shadow-rose-200 text-sm"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
