import React from 'react';
import { HeartHandshake, Truck, Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const PILLARS = [
  {
    icon: HeartHandshake,
    stat: '10,000+',
    title: 'Happy Recipients',
    desc: 'Thousands of smiles delivered with love across Sri Lanka.',
    tag: '4.9 ★ Rating',
  },
  {
    icon: Truck,
    stat: 'Same Day',
    title: 'Speedy Delivery',
    desc: 'Order by 2 PM for guaranteed VIP doorstep arrival in Colombo.',
    tag: 'Midnight Surprises',
  },
  {
    icon: Award,
    stat: '100%',
    title: 'Guaranteed Quality',
    desc: 'Fresh morning blooms, artisan cakes & luxury bespoke gift wrapping.',
    tag: 'Freshness Promise',
  },
  {
    icon: ShieldCheck,
    stat: '24/7',
    title: 'Dedicated Care',
    desc: 'Bank-grade SSL encrypted checkout & friendly customer support.',
    tag: '100% Secure',
  },
];

export default function WhyWishes() {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden my-4 border-y border-[#ecd9c6]/50">
      
      {/* Light Background Image with Soft Champagne Film */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury celebration backdrop"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/96 via-[#f7f3ec]/93 to-[#faf8f5]/90 backdrop-blur-[2px]" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Headline & Description */}
          <div className="w-full lg:w-5/12 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 text-[#990011] border border-rose-200/80 mb-3 shadow-2xs">
              <Sparkles size={12} className="text-[#990011]" />
              <span>The Wishes Promise</span>
            </div>

            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-[1.2] mb-3.5"
            >
              Crafted with Love,{' '}
              <span className="text-[#990011] italic">Delivered with Care</span>
            </h2>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-lg">
              From intimate handwritten notes to grand celebrations, we are honored to be part of your most treasured life moments. Handpicked with devotion, packaged in luxury, and delivered with love across Sri Lanka.
            </p>

            {/* Trust Checklist */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Island-wide Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Compact Cards in 2x2 Grid */}
          <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {PILLARS.map(({ icon: Icon, stat, title, desc, tag }) => (
              <div
                key={title}
                className="group relative bg-white/92 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 border border-[#ecd9c6] shadow-2xs hover:shadow-md hover:bg-white hover:border-[#990011]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#990011] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#faf7f2] border border-[#ecd9c6] flex items-center justify-center text-[#990011] group-hover:bg-[#990011] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon size={16} strokeWidth={2.2} />
                    </div>
                  </div>

                  <div className="text-2xl sm:text-2xl font-black text-gray-900 group-hover:text-[#990011] transition-colors tracking-tight leading-none mb-1">
                    {stat}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug mb-1">
                    {title}
                  </h3>

                  <p className="text-gray-500 text-[11px] sm:text-xs leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
