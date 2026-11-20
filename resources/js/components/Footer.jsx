import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function useSettings() {
  try { return window.__settings || {}; } catch { return {}; }
}

const QUICK_LINKS = [
  { label: 'Home',              to: '/' },
  { label: 'Shop',              to: '/shop' },
  { label: 'Gift by Occasion',  to: '/occasion' },
  { label: 'About Us',          to: '/about' },
  { label: 'Contact Us',        to: '/contact' },
  { label: 'Track Order',       to: '/track-order' },
  { label: 'Privacy Policy',    to: '/privacy-policy' },
];

const CUSTOMER_CARE = [
  { label: 'Help & Support',       to: '/help' },
  { label: 'Returns & Refunds',    to: '/returns' },
  { label: 'Delivery Policy',      to: '/delivery-policy' },
  { label: 'Terms & Conditions',   to: '/terms' },
];

export default function Footer() {
  const settings = useSettings();
  const phone   = settings.phone   || '+94 71 808 0582';
  const email   = settings.email   || 'support@wishes.com';
  const address = settings.address || 'Colombo, Sri Lanka';

  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmailInput('');
  };

  return (
    <footer style={{ backgroundColor: '#111827' }} className="text-gray-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">

          {/* Brand col — spans 2 on lg */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <div className="bg-white rounded-2xl px-3 py-1.5 w-fit shadow-sm">
                <img src="/logo.png" alt="Wishes.com" className="h-10 md:h-11 w-auto object-contain" />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your trusted online gift shop — delivering smiles across Sri Lanka.
            </p>
            <div className="text-sm space-y-1">
              <p>📞 <a href={`tel:${phone}`} className="hover:text-white">{phone}</a></p>
              <p>✉️ <a href={`mailto:${email}`} className="hover:text-white">{email}</a></p>
              <p>📍 {address}</p>
            </div>
            <div className="hidden sm:flex gap-3 text-xl mt-1">
              <a href="#" aria-label="Facebook"  className="hover:text-white">📘</a>
              <a href="#" aria-label="Instagram" className="hover:text-white">📸</a>
              <a href="#" aria-label="TikTok"    className="hover:text-white">🎵</a>
              <a href="#" aria-label="YouTube"   className="hover:text-white">▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              {CUSTOMER_CARE.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay in Touch</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get special offers, free giveaways, and new arrivals.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded-l-lg
                           placeholder-gray-400 outline-none border border-gray-600
                           focus:border-brand"
              />
              <button
                type="submit"
                className="bg-brand hover:bg-brand-dark px-3 py-2 rounded-r-lg
                           text-white transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2025 Wishes.com. All Rights Reserved.</p>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="border border-gray-600 rounded px-2 py-0.5 text-gray-300">VISA</span>
            <span className="border border-gray-600 rounded px-2 py-0.5 text-gray-300">Mastercard</span>
            <span className="border border-gray-600 rounded px-2 py-0.5 text-gray-300">PayHere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
