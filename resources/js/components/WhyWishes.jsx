import React from 'react';
import { HeartHandshake, Truck, Award } from 'lucide-react';

const STATS = [
  {
    icon: HeartHandshake,
    stat: '1000+',
    title: 'Happy Customers',
    desc: 'Thousands of smiles delivered with love across Sri Lanka.',
  },
  {
    icon: Truck,
    stat: 'Same Day',
    title: 'Speedy Delivery',
    desc: 'Order before 2 PM and get it delivered today anywhere in Colombo.',
  },
  {
    icon: Award,
    stat: 'Premium',
    title: 'Guaranteed Quality',
    desc: 'Handpicked fresh blooms, artisan cakes, and luxury gift wrapping.',
  },
];

export default function WhyWishes() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[#c8102e] text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Why Choose Wishes.com?
          </h2>
          <div className="w-12 h-1 bg-[#c8102e] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map(({ icon: Icon, stat, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#c8102e] flex items-center justify-center mb-4 border border-rose-100">
                <Icon size={26} strokeWidth={2} />
              </div>
              <p className="text-2xl font-bold text-[#c8102e] mb-1">{stat}</p>
              <p className="text-base font-semibold text-gray-900 mb-2">{title}</p>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
