import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

export default function EmptyCartView() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-500 mb-4 text-sm font-medium">Your cart is empty.</p>
                    <Link to="/shop" className="px-6 py-2.5 bg-[#c8102e] text-white rounded-xl text-xs font-semibold hover:bg-[#b91c1c] transition-colors shadow-sm">
                        Shop Now
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
