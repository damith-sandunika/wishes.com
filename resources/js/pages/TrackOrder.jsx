import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const timeline = [
  {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    title: 'Order Placed',
    time: 'Nov 18, 2026 10:30 AM',
    desc: 'Your order has been successfully placed.',
    done: true,
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    title: 'Processing',
    time: 'Nov 18, 2026 11:00 AM',
    desc: 'Your order is being prepared and packed.',
    done: true,
  },
  {
    icon: <Truck className="w-6 h-6 text-orange-500" />,
    title: 'Out for Delivery',
    time: 'Nov 18, 2026 2:00 PM',
    desc: 'Your order is on its way to you!',
    active: true,
  },
  {
    icon: <Clock className="w-6 h-6 text-gray-400" />,
    title: 'Delivered',
    time: 'Expected: Today by 6:00 PM',
    desc: 'Your package will be delivered soon.',
    pending: true,
  },
];

export default function TrackOrder() {
  const [orderNum, setOrderNum] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderNum.trim()) setTracked(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-[#dc2626]" />
            <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
          </div>

          <form onSubmit={handleTrack} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                placeholder="e.g. ORD-123456"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
              />
              <button
                type="submit"
                className="bg-[#dc2626] text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-red-700 transition"
              >
                Track Order
              </button>
            </div>
          </form>

          {tracked && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-6">Order #{orderNum} — Status</h2>
              <ol className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                {timeline.map((step, i) => (
                  <li key={i} className="ml-6">
                    <span className="absolute -left-4 flex items-center justify-center bg-white rounded-full">
                      {step.icon}
                    </span>
                    <p className={`font-semibold text-sm ${step.pending ? 'text-gray-400' : 'text-gray-800'}`}>{step.title}</p>
                    <p className={`text-xs mt-0.5 ${step.active ? 'text-orange-500 font-medium' : step.pending ? 'text-gray-400' : 'text-green-600'}`}>{step.time}</p>
                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
