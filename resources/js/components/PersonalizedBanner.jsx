import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Gift, Mail, ArrowRight, Heart } from 'lucide-react';

const FEATURES = [
  {
    icon: Camera,
    title: 'Add Photos',
    desc: 'Polaroid & canvas prints',
  },
  {
    icon: Sparkles,
    title: 'Custom Names',
    desc: 'Laser engraving & gold foil',
  },
  {
    icon: Mail,
    title: 'Gift Message',
    desc: 'Wax-sealed personal notes',
  },
  {
    icon: Gift,
    title: 'Gift Wrapping',
    desc: 'Silk ribbons & luxury boxes',
  },
];

export default function PersonalizedBanner() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#faf8f5] via-[#f7f2eb] to-[#faf8f5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Main Bespoke Card */}
        <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#1b0508] via-[#2d0a11] to-[#120305] text-white p-6 sm:p-10 lg:p-14 overflow-hidden border border-amber-500/25 shadow-2xl">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            
            {/* Left Content Area */}
            <div className="w-full lg:w-7/12 flex flex-col items-start">
              
              {/* Studio Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-4 shadow-xs">
                <Sparkles size={13} className="text-amber-300" />
                <span>Bespoke Gifting Studio</span>
              </div>

              {/* Headline */}
              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-4"
              >
                Make It Truly{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100">
                  Personal
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-xl">
                Add cherished names, memorable photos, or a heartfelt wax-sealed message to create a one-of-a-kind keepsake they will treasure forever.
              </p>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-lg mb-8">
                {FEATURES.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/20 group-hover:scale-105 transition-transform">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-400 leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                to="/occasion/personalized"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-gray-950 font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-95 transition-all text-sm sm:text-base tracking-wide"
              >
                <span>Create a Personalized Gift</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Right Visual Showcase */}
            <div className="w-full lg:w-5/12 relative flex items-center justify-center">
              
              {/* Main Visual Image Card */}
              <div className="relative w-full max-w-md aspect-[4/3.4] rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-gradient-to-b from-[#2a0c10] to-[#120305]">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="Personalized luxury gift"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                  className="w-full h-full object-cover opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-700"
                />
                
                {/* Subtle Inner Glow Border */}
                <div className="absolute inset-0 border border-white/10 rounded-2xl sm:rounded-3xl pointer-events-none" />
              </div>

              {/* Floating Badge 1: Top-Left Photo Memories */}
              <div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-4 bg-white p-2.5 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-2.5 transform -rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-[#c8102e] shrink-0">
                  <Camera size={16} />
                </div>
                <div className="pr-1">
                  <div className="text-xs font-bold text-gray-900 leading-tight">Your Photos</div>
                  <div className="text-[10px] text-gray-500 leading-tight">Polaroid Print</div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom-Right Custom Engraving */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 bg-[#1a0508]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-3 transform rotate-2 hover:rotate-0 transition-transform duration-300 z-10">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <Heart size={16} className="fill-amber-300" />
                </div>
                <div className="pr-1">
                  <div className="text-xs font-bold text-amber-200 leading-tight">Engraved With Love</div>
                  <div className="text-[10px] text-gray-300 leading-tight">Custom Names & Date</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
