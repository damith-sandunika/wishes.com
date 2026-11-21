import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import SocialLinks from './footer/SocialLinks';

function useSettings() {
  try { return window.__settings || {}; } catch { return {}; }
}

const QUICK_LINKS = [
  { label: 'Home',             to: '/' },
  { label: 'Shop All Gifts',   to: '/shop' },
  { label: 'Special Days',     to: '/occasions' },
  { label: 'About Us',         to: '/about' },
  { label: 'Contact Us',       to: '/contact' },
  { label: 'Track Order',      to: '/track-order' },
  { label: 'Privacy Policy',   to: '/privacy-policy' },
];

const CUSTOMER_CARE = [
  { label: 'Help & Support',     to: '/help' },
  { label: 'Returns & Refunds',  to: '/returns' },
  { label: 'Delivery Policy',    to: '/delivery-policy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

export default function Footer() {
  const settings = useSettings();
  const phone   = settings.phone   || '+94 71 808 0582';
  const email   = settings.email   || 'support@wishes.com';
  const address = settings.address || 'Colombo, Sri Lanka';

  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
      setSubscribed(false);
    }, 2500);
  };

  return (
    <footer className="bg-gradient-to-b from-[#140407] via-[#0c0204] to-[#070102] text-gray-300 border-t border-[#ecd9c6]/20 relative overflow-hidden">
      
      {/* Delicate Ambient Glow Leak */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">

          {/* Brand & Boutique Details */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="inline-block">
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl px-3.5 py-2 w-fit shadow-md border border-white/40">
                <img src="/logo.png" alt="Wishes.com" className="h-10 md:h-11 w-auto object-contain" />
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Your trusted luxury online gift shop — crafting cherished memories and delivering heartfelt smiles across Sri Lanka.
            </p>

            <div className="text-xs sm:text-sm space-y-2 mt-1">
              <div className="flex items-center gap-2.5 text-gray-300">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-amber-300 transition-colors">{phone}</a>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-amber-300 transition-colors">{email}</a>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300">
                <MapPin size={14} className="text-amber-400 shrink-0" />
                <span>{address}</span>
              </div>
            </div>

            {/* Social Glass Icons */}
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 hover:text-amber-200 transition-colors inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {CUSTOMER_CARE.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 hover:text-amber-200 transition-colors inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay in Touch Newsletter */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
              Stay in Touch
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Subscribe to receive exclusive offers, luxury gift guides, and seasonal previews.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center bg-white/5 border border-white/15 focus-within:border-amber-400/70 rounded-full p-1 transition-colors">
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 bg-transparent text-white text-xs px-3.5 py-1.5 outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="h-8 px-4 rounded-full bg-gradient-to-r from-[#990011] to-[#b80018] hover:from-[#b80018] hover:to-[#c8102e] text-white text-xs font-semibold flex items-center gap-1 shadow-md active:scale-95 transition-all"
                  aria-label="Subscribe"
                >
                  <span>{subscribed ? 'Joined!' : 'Join'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-amber-300 font-medium pl-2">Thank you for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2025 Wishes.com. All Rights Reserved.</p>

          {/* Powered by DSRZone */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Powered by</span>
            <a
              href="https://dsrzone.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amber-300 hover:text-amber-200 transition-colors tracking-wide underline underline-offset-2"
            >
              DSRZone
            </a>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <span className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1 text-gray-300 shadow-2xs">VISA</span>
            <span className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1 text-gray-300 shadow-2xs">Mastercard</span>
            <span className="bg-white/5 border border-white/15 rounded-md px-2.5 py-1 text-gray-300 shadow-2xs">PayHere</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
