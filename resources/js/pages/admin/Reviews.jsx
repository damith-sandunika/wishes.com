import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminStatusBadge from '../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Star, Search, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    const fetchReviews = useCallback(() => {
        setLoading(true);
        axios.get('/api/reviews', { params: { search, rating: ratingFilter } })
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setReviews(list);
            })
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [search, ratingFilter]);

    useEffect(() => {
        const timer = setTimeout(fetchReviews, 300);
        return () => clearTimeout(timer);
    }, [fetchReviews]);

    const toggleApprove = async (id) => {
        try {
            await axios.patch(`/api/reviews/${id}/toggle-approve`);
            fetchReviews();
        } catch {
            alert('Failed to update status');
        }
    };

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to permanently delete this review?')) return;
        try {
            await axios.delete(`/api/reviews/${id}`);
            fetchReviews();
        } catch {
            alert('Failed to delete review');
        }
    };

    const reviewList = Array.isArray(reviews) 
        ? reviews 
        : (Array.isArray(reviews?.data) ? reviews.data : []);

    return (
        <AdminLayout
            pageTitle="Customer Reviews"
            pageSubtitle="Moderate product ratings, verify customer testimonials, and manage feedback."
            headerActions={
                <div className="flex items-center gap-2">
                    <select
                        value={ratingFilter}
                        onChange={e => setRatingFilter(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-blue-500 shadow-2xs"
                    >
                        <option value="">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            }
        >
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-5 py-3.5">Product</th>
                                <th className="px-5 py-3.5">Customer & Rating</th>
                                <th className="px-5 py-3.5">Review Comment</th>
                                <th className="px-5 py-3.5">Date</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading reviews...</td></tr>
                            ) : reviewList.length === 0 ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">No customer reviews found.</td></tr>
                            ) : reviewList.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4 font-bold text-slate-900">{r.product?.name || '—'}</td>
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-slate-800">{r.customer_name}</div>
                                        <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} className={i < r.rating ? 'text-amber-400' : 'text-slate-300'} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-600 max-w-sm">{r.comment}</td>
                                    <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <AdminStatusBadge status={r.is_approved ? 'Active' : 'Pending'} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button onClick={() => toggleApprove(r.id)} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 ${r.is_approved ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                                                {r.is_approved ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                                                {r.is_approved ? 'Unapprove' : 'Approve'}
                                            </button>
                                            <button onClick={() => destroy(r.id)} className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
