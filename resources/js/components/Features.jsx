import React from 'react';
import { Truck, Calendar, Gift, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Same Day Delivery',
    subtitle: 'Colombo & Suburbs',
  },
  {
    icon: Calendar,
    title: 'Scheduled Delivery',
    subtitle: 'Choose your special date',
  },
  {
    icon: Gift,
    title: 'Premium Packaging',
    subtitle: 'Elegant & secure',
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure Payment',
    subtitle: 'Multiple payment options',
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-brand flex items-center justify-center">
                <Icon size={26} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm md:text-base">{title}</p>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
