import React from 'react';
import { HeartHandshake, Truck, Award, ShieldCheck, Sparkles, CheckCircle2, Star } from 'lucide-react';

const PILLARS = [
  {
    icon: HeartHandshake,
    stat: '10,000+',
    title: 'Happy Recipients',
    desc: 'Thousands of smiles delivered with love across Sri Lanka.',
    badge: '4.9 ★ Rated',
  },
  {
    icon: Truck,
    stat: 'Same Day',
    title: 'VIP Delivery',
    desc: 'Order by 2 PM for guaranteed doorstep arrival in Colombo & suburbs.',
    badge: 'Midnight Surprises',
  },
  {
    icon: Award,
    stat: '100%',
    title: 'Guaranteed Quality',
    desc: 'Fresh morning blooms, artisan cakes & luxury bespoke gift wrapping.',
    badge: 'Freshness Promise',
  },
  {
    icon: ShieldCheck,
    stat: '24/7',
    title: 'Dedicated Care',
    desc: 'Bank-grade SSL encrypted checkout & friendly concierge support.',
    badge: '100% Secure',
  },
];

export default function WhyWishes() {
  return (
    <section className="relative py-14 sm:py-20 my-4 border-y border-[#ecd9c6]/70 bg-gradient-to-b from-[#faf7f2] via-white to-[#faf7f2] overflow-hidden">
      
      {/* Ambient Luxury Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42rem] h-64 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 text-[#990011] border border-rose-200/80 mb-3.5 shadow-2xs">
            <Sparkles size={12} className="text-[#990011]" />
            <span>The Wishes Promise</span>
          </div>

          <h2
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-[1.25] mb-3.5"
          >
            Crafted with Love,{' '}
            <span className="text-[#990011] italic">Delivered with Care</span>
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            From intimate handwritten notes to grand celebrations, we are honored to be part of your most treasured life moments. Handpicked with devotion, packaged in luxury, and delivered with love across Sri Lanka.
          </p>

          {/* Centered Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-5 text-[11px] sm:text-xs font-semibold text-gray-700">
            <span className="inline-flex items-center gap-1.5 bg-white/90 border border-[#ecd9c6] px-3 py-1 rounded-full shadow-2xs">
              <CheckCircle2 size={13} className="text-emerald-600" />
              Island-wide Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 border border-[#ecd9c6] px-3 py-1 rounded-full shadow-2xs">
              <CheckCircle2 size={13} className="text-emerald-600" />
              100% Satisfaction Guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/90 border border-[#ecd9c6] px-3 py-1 rounded-full shadow-2xs">
              <Star size={13} className="text-amber-500 fill-amber-400" />
              4.9 ★ Rating
            </span>
          </div>
        </div>

        {/* 4 Pillars Grid (2 per row on Mobile, 4 across on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {PILLARS.map(({ icon: Icon, stat, title, desc, badge }) => (
            <div
              key={title}
              className="group relative bg-white rounded-2xl p-3.5 sm:p-5 border border-[#ecd9c6] shadow-2xs hover:shadow-xl hover:border-[#990011]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#990011] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full truncate">
                    {badge}
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#faf7f2] border border-[#ecd9c6] flex items-center justify-center text-[#990011] group-hover:bg-[#990011] group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.2} />
                  </div>
                </div>

                {/* Big Stat */}
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 group-hover:text-[#990011] transition-colors tracking-tight leading-none mb-1.5">
                  {stat}
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug mb-1">
                  {title}
                </h3>

                {/* Desc */}
                <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2">
                  {desc}
                </p>
              </div>

              {/* Bottom decorative gold accent line on hover */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-[#990011] transition-colors">
                  Wishes Certified
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#990011] transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
