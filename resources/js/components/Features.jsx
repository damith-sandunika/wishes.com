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
    subtitle: 'Choose your special date & time',
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
    <section className="py-6 sm:py-8 bg-white border-y border-[#ecd9c6]/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x lg:divide-[#ecd9c6]/70">
          {FEATURES.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={title}
              className={`flex items-center gap-3 sm:gap-4 p-2 transition-all duration-300 hover:translate-x-1 ${
                index !== 0 ? 'lg:pl-6' : ''
              }`}
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#faf7f2] border border-[#ecd9c6] flex items-center justify-center text-[#990011] shrink-0 shadow-2xs">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight truncate">
                  {title}
                </p>
                <p className="text-gray-400 text-[11px] sm:text-xs truncate mt-0.5">
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
