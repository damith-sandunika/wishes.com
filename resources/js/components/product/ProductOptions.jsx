import React, { useState, useMemo } from 'react';
import { ShoppingCart, Check, Heart, Star } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const TIME_SLOTS = ['10:00 AM – 1:00 PM', '1:00 PM – 4:00 PM', '4:00 PM – 7:00 PM'];

export default function ProductOptions({ product = {}, onAddToCart, addedToCart, onColorSelect }) {
  const { settings } = useSettings();
  const { 
    name, price = 0, oldPrice, discount = 0, description, rating = 0, reviewsCount = 0, 
    enablePersonalization, enableWrapping = true, colorVariations = [] 
  } = product;

  const wrappingList = useMemo(() => {
    if (!enableWrapping) return [];
    if (settings?.gift_wrapping_options) {
      try {
        const parsed = typeof settings.gift_wrapping_options === 'string'
          ? JSON.parse(settings.gift_wrapping_options) : settings.gift_wrapping_options;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(w => w.active !== false);
      } catch {}
    }
    return [];
  }, [settings?.gift_wrapping_options, enableWrapping]);

  const [selectedColor, setSelectedColor] = useState(colorVariations[0] || null);
  const [selectedWrap, setSelectedWrap] = useState(wrappingList[0] || null);
  const [mugText, setMugText] = useState('');
  const [cardMsg, setCardMsg] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState(TIME_SLOTS[0]);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const stars = Math.round(rating);
  const colorCharge = selectedColor?.extra_price ? Number(selectedColor.extra_price) : 0;
  const wrapCharge = selectedWrap?.price ? Number(selectedWrap.price) : 0;
  const currentPrice = price + colorCharge + wrapCharge;

  const handleColorChange = (c) => {
    setSelectedColor(c);
    if (onColorSelect) onColorSelect(c);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ 
        qty, 
        wrapping: selectedWrap?.name || null, 
        mugText: enablePersonalization ? mugText : '', 
        cardMsg: enablePersonalization ? cardMsg : '', 
        deliveryDate, 
        deliveryTime,
        color: selectedColor?.name || null,
        extraPrice: colorCharge + wrapCharge
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-slate-900 leading-tight">{name}</h1>

      <div className="flex items-center gap-2">
        {reviewsCount > 0 ? (
          <>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className={i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">({reviewsCount} {reviewsCount === 1 ? 'Review' : 'Reviews'})</span>
          </>
        ) : (
          <span className="text-xs text-slate-400 font-medium">No reviews yet</span>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold text-[#c8102e]">Rs. {currentPrice?.toLocaleString()}</span>
        {oldPrice && <span className="text-sm text-slate-400 line-through">Rs. {(oldPrice + colorCharge + wrapCharge).toLocaleString()}</span>}
        {discount > 0 && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>}
      </div>

      {description && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>}

      {colorVariations.length > 0 && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Select Variation: <strong className="text-slate-900">{selectedColor?.name}</strong></span>
            {selectedColor?.extra_price > 0 && <span className="text-xs text-[#c8102e] font-bold">+Rs. {selectedColor.extra_price.toLocaleString()}</span>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {colorVariations.map((c, i) => (
              <button key={i} type="button" onClick={() => handleColorChange(c)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${selectedColor?.name === c.name ? 'border-[#c8102e] bg-white shadow-2xs ring-1 ring-[#c8102e]/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: c.code }} />
                <span className="text-xs font-medium text-slate-800">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {enablePersonalization && (
        <div className="bg-rose-50/40 rounded-xl p-4 space-y-3 border border-rose-100">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">Personalize Your Gift</p>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Custom Name / Inscription Message</label>
            <input type="text" maxLength={40} value={mugText} onChange={e => setMugText(e.target.value)}
              placeholder="e.g. Happy Anniversary Sarah!" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c8102e] bg-white" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Greeting Card Message</label>
              <span className="text-[10px] text-slate-400">{cardMsg.length}/150</span>
            </div>
            <textarea maxLength={150} value={cardMsg} onChange={e => setCardMsg(e.target.value)}
              placeholder="Write your heartfelt message here..." rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c8102e] bg-white resize-none" />
          </div>
        </div>
      )}

      {enableWrapping && wrappingList.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Gift Wrapping Style</p>
          <div className="flex gap-2 flex-wrap">
            {wrappingList.map(w => (
              <button key={w.id || w.name} type="button" onClick={() => setSelectedWrap(w)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all min-w-[70px] ${(selectedWrap?.name === w.name || selectedWrap?.id === w.id) ? 'border-[#c8102e] ring-2 ring-red-100 bg-white shadow-2xs' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <div className="w-6 h-6 rounded-full shadow-2xs border border-black/10" style={{ backgroundColor: w.code || '#ddd' }} />
                <span className="text-[10px] text-slate-700 text-center leading-tight truncate max-w-[80px]">{w.name}</span>
                {Number(w.price) > 0 ? <span className="text-[9px] text-[#c8102e] font-bold">+Rs. {Number(w.price).toLocaleString()}</span> : <span className="text-[9px] text-emerald-600 font-semibold">Free</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Preferred Delivery Date</label>
          <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c8102e]" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Time Slot</label>
          <select value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#c8102e] bg-white">
            {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center border border-slate-200 rounded-xl bg-white">
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-sm text-slate-600 hover:text-black font-bold">-</button>
          <span className="px-2 text-sm font-bold text-slate-800">{qty}</span>
          <button type="button" onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-sm text-slate-600 hover:text-black font-bold">+</button>
        </div>
        <button type="button" onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all ${addedToCart ? 'bg-emerald-600 text-white' : 'bg-[#c8102e] hover:bg-red-800 text-white'}`}>
          {addedToCart ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> Add to Cart</>}
        </button>
        <button type="button" onClick={() => setWishlisted(!wishlisted)} className="p-3 border border-slate-200 rounded-xl hover:border-rose-300 transition-colors">
          <Heart size={18} className={wishlisted ? 'text-[#c8102e] fill-[#c8102e]' : 'text-slate-400'} />
        </button>
      </div>
    </div>
  );
}
