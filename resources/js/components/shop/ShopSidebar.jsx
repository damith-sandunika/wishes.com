import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OCCASIONS_LIST = ['Birthday', 'Anniversary', "Valentine's Day", "Mother's Day", "Father's Day", 'Graduation'];
const DELIVERY_OPTIONS = [
  { label: '⚡ Same Day Delivery', value: 'same_day' },
  { label: 'Next Day Delivery', value: 'next_day' },
  { label: 'Scheduled Delivery', value: 'scheduled' },
];
const RATINGS = [
  { label: '⭐⭐⭐⭐⭐', count: 120, value: '5' },
  { label: '⭐⭐⭐⭐ & above', count: 198, value: '4' },
  { label: '⭐⭐⭐ & above', count: 243, value: '3' },
  { label: '⭐⭐ & above', count: 267, value: '2' },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group">
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 group-hover:text-brand" />
               : <ChevronDown size={16} className="text-gray-400 group-hover:text-brand" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

export default function ShopSidebar({ categories = [], filters, onFilterChange, onClose }) {
  const [local, setLocal] = useState({
    categories: filters?.categories || [],
    priceMin: filters?.priceMin || '',
    priceMax: filters?.priceMax || '',
    occasions: filters?.occasions || [],
    delivery: filters?.delivery || [],
    rating: filters?.rating || '',
  });
  const [showAllCats, setShowAllCats] = useState(false);

  const toggle = (field, value) => {
    setLocal(prev => {
      const arr = prev[field];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [field]: next };
    });
  };

  const handleApply = () => {
    onFilterChange(local);
    if (onClose) onClose();
  };
  const handleClear = () => {
    const empty = { categories: [], priceMin: '', priceMax: '', occasions: [], delivery: [], rating: '' };
    setLocal(empty);
    onFilterChange(empty);
  };

  const visibleCats = showAllCats ? categories : categories.slice(0, 5);
  // fake counts
  const catCount = (i) => [45, 38, 29, 22, 17, 14, 11, 9, 7, 5][i % 10];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-gray-800">Filters</span>
        <button onClick={handleClear} className="text-xs text-brand font-medium hover:underline">Clear All</button>
      </div>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-2">
          {visibleCats.map((cat, i) => (
            <label key={cat.id || i} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input type="checkbox"
                  checked={local.categories.includes(cat.name)}
                  onChange={() => toggle('categories', cat.name)}
                  className="accent-brand w-4 h-4 cursor-pointer" />
                <span className="text-sm text-gray-700 group-hover:text-brand transition-colors">{cat.name}</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{catCount(i)}</span>
            </label>
          ))}
          {categories.length > 5 && (
            <button onClick={() => setShowAllCats(!showAllCats)}
              className="text-xs text-brand font-medium mt-1 hover:underline">
              {showAllCats ? 'Show Less' : `Show More (${categories.length - 5} more)`}
            </button>
          )}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price Range">
        <div className="space-y-2.5">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <span className="px-2 py-1.5 text-xs text-gray-400 bg-gray-50 border-r border-gray-200">LKR</span>
              <input type="number" placeholder="0" value={local.priceMin}
                onChange={e => setLocal(p => ({ ...p, priceMin: e.target.value }))}
                className="w-full px-2 py-1.5 text-sm text-gray-700 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <span className="px-2 py-1.5 text-xs text-gray-400 bg-gray-50 border-r border-gray-200">LKR</span>
              <input type="number" placeholder="50000" value={local.priceMax}
                onChange={e => setLocal(p => ({ ...p, priceMax: e.target.value }))}
                className="w-full px-2 py-1.5 text-sm text-gray-700 focus:outline-none" />
            </div>
          </div>
        </div>
      </Section>

      {/* Occasion */}
      <Section title="Occasion">
        <div className="space-y-2">
          {OCCASIONS_LIST.map(o => (
            <label key={o} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox"
                checked={local.occasions.includes(o)}
                onChange={() => toggle('occasions', o)}
                className="accent-brand w-4 h-4 cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-brand transition-colors">{o}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Delivery */}
      <Section title="Delivery">
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map(d => (
            <label key={d.value} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox"
                checked={local.delivery.includes(d.value)}
                onChange={() => toggle('delivery', d.value)}
                className="accent-brand w-4 h-4 cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-brand transition-colors">{d.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Rating */}
      <Section title="Rating" defaultOpen={false}>
        <div className="space-y-2">
          {RATINGS.map(r => (
            <label key={r.value} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input type="radio" name="rating" value={r.value}
                  checked={local.rating === r.value}
                  onChange={() => setLocal(p => ({ ...p, rating: r.value }))}
                  className="accent-brand w-4 h-4 cursor-pointer" />
                <span className="text-sm text-gray-700 group-hover:text-brand transition-colors">{r.label}</span>
              </div>
              <span className="text-xs text-gray-400">({r.count})</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Apply */}
      <button onClick={handleApply}
        className="w-full bg-brand hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-2">
        Apply Filters
      </button>
    </div>
  );
}
