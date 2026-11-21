import React, { useState } from 'react';
import { Sparkles, X, Check, Heart } from 'lucide-react';

export default function PersonalizationModal({ isOpen, onClose, personalizedItems = [], onConfirm }) {
    if (!isOpen || personalizedItems.length === 0) return null;

    const [selected, setSelected] = useState({});
    const [chosenOptions, setChosenOptions] = useState({});
    const [inputs, setInputs] = useState({});

    const toggle = (item) => {
        const next = { ...selected, [item.id]: !selected[item.id] };
        const nextOpts = { ...chosenOptions };
        if (next[item.id] && item.options?.length > 0 && !nextOpts[item.id]) {
            nextOpts[item.id] = item.options[0];
        }
        setSelected(next);
        setChosenOptions(nextOpts);
    };

    const handleOptionSelect = (itemId, opt) => {
        setChosenOptions(prev => ({ ...prev, [itemId]: opt }));
    };

    const handleInputChange = (itemId, label, val) => {
        setInputs(prev => ({
            ...prev,
            [itemId]: { ...(prev[itemId] || {}), [label]: val }
        }));
    };

    const handleApply = () => {
        const chosen = personalizedItems.filter(item => selected[item.id]).map(item => {
            const opt = chosenOptions[item.id] || (item.options?.[0] || null);
            const effPrice = opt?.price !== undefined && opt?.price !== '' ? Number(opt.price) : item.price;
            return {
                ...item,
                price: effPrice,
                selected_option: opt,
                image: opt?.image || item.image,
                custom_inputs: inputs[item.id] || {},
            };
        });
        onConfirm(chosen);
    };

    const handleSkip = () => {
        onConfirm([]);
    };

    const selectedCount = Object.values(selected).filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-rose-100">
                {/* Modal Header */}
                <div className="p-5 bg-gradient-to-r from-rose-50 via-white to-amber-50 border-b border-rose-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-[#c8102e] text-white shadow-sm shadow-red-500/25">
                            <Sparkles size={18} />
                        </span>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 leading-tight">Make It Truly Personal?</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Add a wax-sealed card or custom keepsake to this gift</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body with Scroll */}
                <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Do you need any customized items with this order? Select below or skip to continue directly:
                    </p>

                    <div className="space-y-3">
                        {personalizedItems.map(item => {
                            const isChecked = Boolean(selected[item.id]);
                            const currentOpt = chosenOptions[item.id] || item.options?.[0];
                            const displayPrice = isChecked && currentOpt?.price !== undefined && currentOpt?.price !== '' ? Number(currentOpt.price) : item.price;
                            const activeThumb = currentOpt?.image || item.options?.[0]?.image || item.image;

                            return (
                                <div key={item.id} className={`rounded-2xl border transition-all ${
                                    isChecked ? 'bg-rose-50/40 border-[#c8102e] ring-1 ring-[#c8102e]/30 shadow-xs' : 'bg-white border-slate-200 hover:border-rose-300'
                                }`}>
                                    <div onClick={() => toggle(item)} className="flex items-center justify-between p-3 cursor-pointer">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 flex items-center justify-center">
                                                {activeThumb ? (
                                                    <img src={activeThumb} alt={item.name} className="w-full h-full object-cover" />
                                                ) : <span className="text-2xl">{item.icon || '✨'}</span>}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight">{item.name}</p>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
                                                <p className="text-xs text-[#c8102e] font-extrabold mt-1">
                                                    {Number(displayPrice) > 0 ? `+ Rs. ${Number(displayPrice).toLocaleString()}` : 'Free'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 ml-2 rounded-lg flex items-center justify-center border shrink-0 transition-colors ${
                                            isChecked ? 'bg-[#c8102e] border-[#c8102e] text-white shadow-2xs' : 'border-slate-300 bg-white'
                                        }`}>
                                            {isChecked && <Check size={14} strokeWidth={3} />}
                                        </div>
                                    </div>

                                    {/* Options & Fields inside item */}
                                    {isChecked && (item.options?.length > 0 || item.custom_fields?.length > 0) && (
                                        <div className="p-3 pt-2 border-t border-rose-100 bg-white/70 rounded-b-2xl space-y-2.5 text-xs">
                                            {item.options?.length > 0 && (
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">Select Style:</label>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.options.map((opt, i) => {
                                                            const isOptActive = (currentOpt?.name === opt.name) || (!chosenOptions[item.id] && i === 0);
                                                            return (
                                                                <button key={i} type="button" onClick={() => handleOptionSelect(item.id, opt)}
                                                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                                                                        isOptActive ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                                                    }`}>
                                                                    {opt.image && <img src={opt.image} alt={opt.name} className="w-4 h-4 rounded-sm object-cover border border-white/50" />}
                                                                    <span>{opt.name}</span>
                                                                    {opt.price ? <span className="opacity-80 font-normal">({Number(opt.price) > 0 ? `+Rs. ${Number(opt.price).toLocaleString()}` : 'Free'})</span> : null}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {item.custom_fields?.map((fld, idx) => (
                                                <div key={idx}>
                                                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                                                        {fld.label} {fld.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    <input
                                                        type={fld.type === 'number' ? 'number' : 'text'}
                                                        value={inputs[item.id]?.[fld.label] || ''}
                                                        onChange={e => handleInputChange(item.id, fld.label, e.target.value)}
                                                        placeholder={fld.placeholder || `Enter ${fld.label}`}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#c8102e]"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                    <button type="button" onClick={handleSkip} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
                        No thanks, Skip
                    </button>
                    <button type="button" onClick={handleApply} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#c8102e] hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95">
                        <Sparkles size={14} />
                        {selectedCount > 0 ? `Add Selected (${selectedCount}) & Continue` : 'Continue to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}
