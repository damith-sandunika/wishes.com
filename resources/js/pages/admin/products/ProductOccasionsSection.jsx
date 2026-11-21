import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import axios from 'axios';

export default function ProductOccasionsSection({ form, setForm }) {
    const occasions = Array.isArray(form.occasions) ? form.occasions : [];
    const [occasionsList, setOccasionsList] = useState([]);

    useEffect(() => {
        axios.get('/api/public/occasions')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
                setOccasionsList(list);
            })
            .catch(() => setOccasionsList([]));
    }, []);

    const toggleOccasion = (slug) => {
        const next = occasions.includes(slug) ? occasions.filter(s => s !== slug) : [...occasions, slug];
        setForm({ ...form, occasions: next });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Calendar size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">6. Suitable Special Days</h3>
                    <p className="text-[11px] text-slate-500">Tag special celebration days (Birthdays, Anniversaries, etc.) where this gift item will be suggested to shoppers.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
                {(Array.isArray(occasionsList) ? occasionsList : []).map(occ => {
                    const isSelected = occasions.includes(occ.slug);
                    return (
                        <button
                            key={occ.id}
                            type="button"
                            onClick={() => toggleOccasion(occ.slug)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                isSelected
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/20'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {occ.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
