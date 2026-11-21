import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function PageHero({
  title = 'Shop Gifts',
  subtitle = "Discover curated gifts tailored for life's most precious occasions.",
  badge = 'Curated Collection',
  breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Shop Gifts' },
  ],
}) {
  const words = (title || '').split(' ');
  const firstPart = words.length > 1 ? words.slice(0, -1).join(' ') + ' ' : '';
  const lastWord = words.length > 0 ? words[words.length - 1] : title;

  return (
    <section
      className="relative w-full overflow-hidden py-5 sm:py-6 border-b border-[#ecd9c6]/80 shadow-xs"
      style={{
        background: 'linear-gradient(135deg, #faf7f4 0%, #fff0eb 25%, #fdf6ec 50%, #fff2f5 75%, #faf7f4 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientFlow 12s ease-in-out infinite',
      }}
    >
      {/* Inline Keyframes for Moving Luxury Background Mesh & Lattice Drift */}
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes driftLattice {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes floatGold {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          50% { transform: translate(30px, -15px) scale(1.15); opacity: 0.55; }
        }
        @keyframes floatCrimson {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
          50% { transform: translate(-25px, 12px) scale(0.95); opacity: 0.5; }
        }
        @keyframes floatSunshine {
          0%, 100% { transform: translate(0px, 0px) scale(1); opacity: 0.35; }
          50% { transform: translate(15px, 20px) scale(1.1); opacity: 0.6; }
        }
      `}</style>

      {/* Visible Moving Color Glow Orbs (Rose Red, Warm Gold, Sunshine Yellow) */}
      <div
        className="absolute -top-12 left-8 w-72 h-72 bg-gradient-to-br from-rose-500/25 to-pink-500/15 rounded-full blur-2xl pointer-events-none"
        style={{ animation: 'floatCrimson 8s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-10 right-1/4 w-80 h-80 bg-gradient-to-tl from-amber-400/30 to-yellow-300/20 rounded-full blur-2xl pointer-events-none"
        style={{ animation: 'floatGold 10s ease-in-out infinite' }}
      />
      <div
        className="absolute top-1/2 right-12 -translate-y-1/2 w-60 h-60 bg-gradient-to-tr from-yellow-300/35 to-amber-200/20 rounded-full blur-xl pointer-events-none"
        style={{ animation: 'floatSunshine 7s ease-in-out infinite reverse' }}
      />

      {/* Moving Luxury Geometric Diamond Lattice Pattern */}
      <svg
        className="absolute inset-0 w-[120%] h-full opacity-[0.09] pointer-events-none"
        style={{ animation: 'driftLattice 16s ease-in-out infinite' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="luxury-active-pattern" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="#d4af37" strokeWidth="1" />
            <circle cx="18" cy="18" r="1.5" fill="#f59e0b" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#luxury-active-pattern)" />
      </svg>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        
        {/* Clean Natural Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <span className="text-gray-300 text-[10px]">/</span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-[#990011] transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-800 font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Title & Badge Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-none">
              {firstPart}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#990011] via-[#c8102e] to-amber-600">
                {lastWord}
              </span>
            </h1>

            {subtitle && (
              <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed max-w-xl font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* New Custom Luxury Gold-Framed Capsule Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-amber-300/80 shadow-xs shadow-amber-500/10 shrink-0 self-start sm:self-center">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#990011]" />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#990011] to-amber-700">
                {badge}
              </span>
              <Sparkles size={13} className="text-amber-500 animate-pulse" />
            </div>
          )}
        </div>

      </div>

      {/* Bottom Shimmering Gold Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
    </section>
  );
}
