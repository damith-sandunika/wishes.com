import React, { useState } from 'react';
import axios from 'axios';
import { Star, CheckCircle, Send } from 'lucide-react';

export default function ProductReviews({ productId, productName = 'this gift', initialReviews = [] }) {
    const [reviews, setReviews] = useState(() => {
        return (initialReviews || []).map(r => ({
            id: r.id,
            author: r.author_name || 'Customer',
            rating: Number(r.rating) || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recently',
            verified: true,
            title: r.title || 'Verified Purchase',
            content: r.content,
        }));
    });

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', rating: 5, title: '', content: '' });
    const [submitted, setSubmitted] = useState(false);

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.content) return;

        let createdReview = {
            id: Date.now(),
            author: form.name,
            rating: Number(form.rating),
            date: 'Just now',
            verified: true,
            title: form.title || 'Customer Review',
            content: form.content,
        };

        if (productId) {
            try {
                const res = await axios.post(`/api/public/products/${productId}/reviews`, {
                    author_name: form.name,
                    rating: Number(form.rating),
                    title: form.title,
                    content: form.content,
                });
                if (res.data?.id) createdReview.id = res.data.id;
            } catch {}
        }

        setReviews(prev => [createdReview, ...prev]);
        setSubmitted(true);
        setTimeout(() => {
            setShowForm(false);
            setSubmitted(false);
            setForm({ name: '', rating: 5, title: '', content: '' });
        }, 1500);
    };

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Customer Reviews</h3>
                    {totalReviews > 0 ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={15} fill={star <= Math.round(Number(avgRating)) ? 'currentColor' : 'none'} className={star <= Math.round(Number(avgRating)) ? 'text-amber-400' : 'text-slate-200'} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{avgRating}</span>
                            <span className="text-xs text-slate-400">({totalReviews} verified {totalReviews === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500">No reviews yet. Share your experience first!</p>
                    )}
                </div>

                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#c8102e] hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs w-fit"
                >
                    {showForm ? 'Cancel Review' : 'Write a Review'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="my-6 p-5 bg-rose-50/40 rounded-2xl border border-rose-100 animate-in fade-in duration-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Review for {productName}</h4>
                    {submitted ? (
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                            <CheckCircle size={15} /> Thank you! Your review has been submitted.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-700">Rating:</span>
                                <div className="flex gap-1 text-amber-400">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button 
                                            key={s} 
                                            type="button" 
                                            onClick={() => setForm({ ...form, rating: s })}
                                            className="p-0.5 hover:scale-110 transition-transform"
                                        >
                                            <Star size={18} fill={s <= form.rating ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Your Name *" 
                                    value={form.name} 
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#c8102e] outline-none" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Review Title (Optional)" 
                                    value={form.title} 
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#c8102e] outline-none" 
                                />
                            </div>

                            <textarea 
                                required 
                                rows="3" 
                                placeholder="Write your heartfelt feedback here..." 
                                value={form.content} 
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-[#c8102e] outline-none resize-none"
                            />

                            <button type="submit" className="inline-flex items-center gap-1.5 bg-[#c8102e] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-800 transition">
                                <Send size={13} /> Submit Review
                            </button>
                        </div>
                    )}
                </form>
            )}

            <div className="space-y-4 divide-y divide-slate-100">
                {reviews.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                        No customer reviews recorded yet for this item.
                    </div>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="pt-4 first:pt-3">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 text-xs">{r.author}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} /> Verified
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">{r.date}</span>
                            </div>

                            <div className="flex gap-0.5 text-amber-400 mb-1.5">
                                {[...Array(r.rating)].map((_, i) => (
                                    <Star key={i} size={12} fill="currentColor" />
                                ))}
                            </div>

                            {r.title && <h5 className="font-bold text-slate-900 text-xs mb-0.5">{r.title}</h5>}
                            <p className="text-slate-600 text-xs leading-relaxed">{r.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
