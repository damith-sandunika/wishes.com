import React from 'react';
import { Truck, Calendar, Gift, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Same Day Delivery',
    subtitle: 'Colombo & Greater Suburbs',
  },
  {
    icon: Calendar,
    title: 'Scheduled Delivery',
    subtitle: 'Choose special date & time',
  },
  {
    icon: Gift,
    title: 'Signature Packaging',
    subtitle: 'Luxury bespoke boxes & ribbons',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Checkout',
    subtitle: '100% Protected SSL payments',
  },
];

export default function Features() {
  return (
    <section className="py-3.5 sm:py-5 bg-gradient-to-r from-white via-rose-50/40 to-white border-y border-rose-100/70 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 lg:divide-x lg:divide-rose-100/80">
          {FEATURES.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={title}
              className={`flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-2 rounded-2xl bg-white/90 sm:bg-transparent border border-rose-100/80 sm:border-0 shadow-2xs sm:shadow-none hover:shadow-xs transition-all duration-300 group ${
                index !== 0 ? 'lg:pl-6' : ''
              }`}
            >
              <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-rose-50/80 border border-rose-200/80 text-[#c8102e] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <Icon size={18} strokeWidth={2.2} className="sm:hidden" />
                <Icon size={20} strokeWidth={2} className="hidden sm:block" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-slate-900 text-[11px] sm:text-xs md:text-[13px] tracking-tight leading-tight truncate">
                  {title}
                </p>
                <p className="text-slate-500 text-[9.5px] sm:text-[11px] font-medium leading-tight truncate mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
