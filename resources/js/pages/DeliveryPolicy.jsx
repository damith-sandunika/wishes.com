import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function DeliveryPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <PageHero
                title="Delivery & Shipping Policy"
                subtitle="Fast, secure and temperature-controlled gift delivery across Sri Lanka."
                badge="White-Glove Courier"
                breadcrumbs={[
                    { label: 'Home', to: '/' },
                    { label: 'Delivery Policy' }
                ]}
            />
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-brand shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">Same Day Delivery</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">Available for Colombo 1-15 &amp; Greater Colombo for orders placed before 12:00 PM noon.</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-brand shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm mb-1">Islandwide Delivery</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">Delivered within 1 to 2 working days via our reliable courier partners with live tracking.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6 text-xs md:text-sm text-gray-600 leading-relaxed">
                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">1. Delivery Charges</h4>
                        <p>Standard delivery charge across the island is <strong>LKR 350</strong>. Orders exceeding <strong>LKR 5,000</strong> qualify for 100% Free Delivery. Same-day express priority delivery is available for <strong>LKR 750</strong>.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">2. Cake &amp; Perishable Handling</h4>
                        <p>Cakes and fresh floral bouquets are transported in dedicated refrigerated containers to preserve temperature and structural integrity during transit.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">3. Recipient Contact &amp; Surprise Policy</h4>
                        <p>If you prefer a complete surprise delivery, you can mention it during checkout. Our delivery rider will only contact the recipient upon arrival at the gate.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
