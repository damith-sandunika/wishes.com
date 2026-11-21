import React from 'react';
import { Heart, Gift, Truck, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

const stats = [
  { icon: <Heart className="w-7 h-7 text-[#dc2626]" />, label: '5000+', sub: 'Happy Customers' },
  { icon: <Gift className="w-7 h-7 text-[#dc2626]" />, label: '500+', sub: 'Products' },
  { icon: <Truck className="w-7 h-7 text-[#dc2626]" />, label: 'Same Day', sub: 'Delivery' },
  { icon: <Star className="w-7 h-7 text-[#dc2626]" />, label: '5 ⭐', sub: 'Rated Service' },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <PageHero
          title="About Wishes.com"
          subtitle="Your trusted online luxury gift boutique delivering smiles across Sri Lanka."
          badge="Our Story & Vision"
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'About Us' }
          ]}
        />

        {/* Story */}
        <section className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80"
            alt="Our Story"
            className="rounded-2xl shadow-lg w-full h-72 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Wishes.com was founded with a simple mission: to make every special moment unforgettable.
              We believe that the perfect gift can speak volumes — expressing love, gratitude, celebration, and care
              when words fall short. From birthdays to anniversaries, we curate thoughtful gifts that leave
              lasting impressions and warm hearts across Sri Lanka.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-12 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                {s.icon}
                <span className="text-2xl font-bold text-gray-800 mt-3">{s.label}</span>
                <span className="text-sm text-gray-500 mt-1">{s.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-4 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to deliver joy, love, and happiness through thoughtful gifts — making every occasion
            special, every memory treasured, and every person feel truly celebrated.
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
