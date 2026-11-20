import React from 'react';
import { Link } from 'react-router-dom';

const CHIPS = ['Add Photos', 'Add Names', 'Gift Message', 'Gift Wrapping'];

export default function PersonalizedBanner() {
  return (
    <section className="py-12 bg-gradient-to-br from-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center gap-10">

          {/* Left: image */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&q=80"
              alt="Personalized gift box"
              className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
            />
          </div>

          {/* Right: content */}
          <div className="w-full md:w-7/12">
            <span className="inline-block bg-brand text-white text-xs font-semibold
                             px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Personalized Gifts
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Make It Truly Personal
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Add names, photos, or a heartfelt message to create a one-of-a-kind gift
              they'll always remember.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="bg-white border border-rose-200 text-gray-700 text-sm
                             px-4 py-1.5 rounded-full shadow-sm"
                >
                  ✓ {chip}
                </span>
              ))}
            </div>

            <Link
              to="/occasion/personalized"
              className="inline-block bg-brand hover:bg-brand-dark text-white font-semibold
                         px-7 py-3 rounded-xl transition-colors duration-200 shadow-md"
            >
              Create a Personalized Gift →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
