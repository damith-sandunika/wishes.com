import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Plus, Pencil, Trash2, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OccasionIndex() {
    const [occasions, setOccasions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = () => {
        setLoading(true);
        axios.get('/api/occasions')
            .then(res => {
                const list = Array.isArray(res.data) 
                    ? res.data 
                    : (Array.isArray(res.data?.data) ? res.data.data : []);
                setOccasions(list);
            })
            .catch(() => setOccasions([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []);

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this occasion?')) return;
        try {
            await axios.delete(`/api/occasions/${id}`);
            fetchAll();
        } catch {
            alert('Cannot delete this occasion.');
        }
    };

    const occList = Array.isArray(occasions) 
        ? occasions 
        : (Array.isArray(occasions?.data) ? occasions.data : []);

    return (
        <AdminLayout
            pageTitle="Gift Occasions"
            pageSubtitle="Campaigns and festive occasions (Birthdays, Anniversaries, Romance, Corporate)."
            headerActions={
                <Link
                    to="/admin/occasions/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                >
                    <Plus size={15} strokeWidth={2.5} /> Add Occasion
                </Link>
            }
        >
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-5 py-3.5">Occasion &amp; Photo</th>
                                <th className="px-5 py-3.5">Slug</th>
                                <th className="px-5 py-3.5">Description</th>
                                <th className="px-5 py-3.5">Icon</th>
                                <th className="px-5 py-3.5">Status</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading occasions...</td></tr>
                            ) : occList.length === 0 ? (
                                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">No occasions configured yet. Click "Add Occasion" to create one.</td></tr>
                            ) : occList.map(occ => (
                                <tr key={occ.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                                {occ.image ? (
                                                    <img src={occ.image} alt={occ.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50"><Sparkles size={16} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-xs leading-tight">{occ.title}</p>
                                                <a href={`/shop?occasion=${occ.slug}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-0.5 mt-0.5">
                                                    View in Storefront <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-slate-500">{occ.slug}</td>
                                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{occ.description || '—'}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                                            {occ.icon || 'Gift'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <AdminStatusBadge status={occ.is_active ? 'Active' : 'Inactive'} />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link to={`/admin/occasions/${occ.id}/edit`} className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                <Pencil size={13} /> Edit
                                            </Link>
                                            <button onClick={() => destroy(occ.id)} className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
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
