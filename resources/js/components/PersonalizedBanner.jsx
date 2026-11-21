import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Gift, Mail, ArrowRight, Heart } from 'lucide-react';

const FEATURES = [
  { icon: Camera, title: 'Add Photos', desc: 'Polaroid & canvas prints' },
  { icon: Sparkles, title: 'Custom Names', desc: 'Laser engraving & gold foil' },
  { icon: Mail, title: 'Gift Message', desc: 'Wax-sealed personal notes' },
  { icon: Gift, title: 'Gift Wrapping', desc: 'Silk ribbons & luxury boxes' },
];

export default function PersonalizedBanner() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-rose-50/40 via-white to-rose-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Main Bespoke Card with Luxury Red Brand Theme */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#940b1e] via-[#c8102e] to-[#730514] text-white p-6 sm:p-10 lg:p-14 overflow-hidden border border-rose-300/30 shadow-2xl shadow-[#c8102e]/25">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-12 -right-12 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Left Content Area */}
            <div className="w-full lg:w-7/12 flex flex-col items-start">
              {/* Studio Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 text-white border border-white/30 mb-4 shadow-2xs backdrop-blur-md">
                <Sparkles size={13} className="text-amber-200" />
                <span>Bespoke Gifting Studio</span>
              </div>

              {/* Headline */}
              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4"
              >
                Make It Truly{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-100">
                  Personal
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl font-medium">
                Add cherished names, memorable photos, or a heartfelt wax-sealed message to create a one-of-a-kind keepsake they will treasure forever.
              </p>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-lg mb-8">
                {FEATURES.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/15 hover:border-white/40 transition-all duration-300 group shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/30 group-hover:scale-105 transition-transform">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-rose-100/80 leading-tight mt-0.5 font-medium">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/occasions"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-rose-50 text-[#c8102e] font-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl shadow-black/20 hover:shadow-2xl active:scale-95 transition-all text-sm sm:text-base tracking-wide group"
              >
                <span>Create a Personalized Gift</span>
                <ArrowRight size={17} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Visual Showcase */}
            <div className="w-full lg:w-5/12 relative flex items-center justify-center">
              {/* Main Visual Image Card */}
              <div className="relative w-full max-w-md aspect-[4/3.4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/25 shadow-2xl bg-gradient-to-b from-[#800010] to-[#50000a]">
                <img
                  src="/images/personalized-bespoke-gift.jpg"
                  alt="Personalized luxury gift"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge 1: Top-Left Photo Memories */}
              <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-4 bg-white p-2.5 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-2.5 transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#c8102e] shrink-0">
                  <Camera size={16} />
                </div>
                <div className="pr-1">
                  <div className="text-xs font-bold text-gray-900 leading-tight">Your Photos</div>
                  <div className="text-[10px] text-gray-500 leading-tight font-medium">Polaroid Print</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom-Right Custom Engraving */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-xl border border-rose-200/80 flex items-center gap-3 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-10">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#c8102e] flex items-center justify-center shrink-0 border border-rose-100">
                  <Heart size={16} className="fill-[#c8102e] text-[#c8102e]" />
                </div>
                <div className="pr-1">
                  <div className="text-xs font-bold text-gray-900 leading-tight">Engraved With Love</div>
                  <div className="text-[10px] text-gray-500 leading-tight font-medium">Custom Names &amp; Date</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
