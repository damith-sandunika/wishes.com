import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { Plus, Pencil, Trash2, Calendar, X, CheckCircle2, XCircle } from 'lucide-react';

export default function OccasionIndex() {
    const [occasions, setOccasions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null, 'create', or occasion object
    const [form, setForm] = useState({ title: '', slug: '', description: '', image: '', icon: 'Gift', is_active: true });
    const [saving, setSaving] = useState(false);

    const fetchAll = () => {
        setLoading(true);
        axios.get('/api/occasions')
            .then(res => setOccasions(res.data.data || res.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(); }, []);

    const openCreate = () => {
        setForm({ title: '', slug: '', description: '', image: '', icon: 'Gift', is_active: true });
        setModal('create');
    };

    const openEdit = (occ) => {
        setForm({ ...occ });
        setModal(occ);
    };

    const saveOccasion = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (modal === 'create') {
                await axios.post('/api/occasions', form);
            } else {
                await axios.put(`/api/occasions/${modal.id}`, form);
            }
            setModal(null);
            fetchAll();
        } catch {
            alert('Error saving occasion. Please verify fields.');
        } finally {
            setSaving(false);
        }
    };

    const destroy = async (id) => {
        if (!confirm('Are you sure you want to delete this occasion?')) return;
        try {
            await axios.delete(`/api/occasions/${id}`);
            fetchAll();
        } catch {
            alert('Cannot delete this occasion.');
        }
    };

    const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#1933C6] outline-none";

    return (
        <AdminLayout>
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Gift Occasions</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Manage Occasions &amp; Campaigns</p>
                </div>
                <button onClick={openCreate} className="relative z-10 bg-[#1933C6] hover:bg-[#090087] text-white px-5 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <Plus size={16} /> Add Occasion
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="text-left px-6 py-3">Occasion</th>
                                <th className="text-left px-6 py-3">Slug</th>
                                <th className="text-left px-6 py-3">Description</th>
                                <th className="text-left px-6 py-3">Status</th>
                                <th className="text-right px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}><td colSpan="5" className="px-6 py-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>
                                ))
                            ) : occasions.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-400">No occasions found.</td></tr>
                            ) : occasions.map((occ) => (
                                <tr key={occ.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {occ.image ? (
                                                <img src={occ.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-pink-50 text-[#c8102e] flex items-center justify-center font-bold">🎉</div>
                                            )}
                                            <span className="font-semibold text-slate-800">{occ.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">/shop?occasion={occ.slug}</td>
                                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate">{occ.description || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${occ.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {occ.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {occ.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(occ)} className="px-3 py-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg text-xs font-medium">Edit</button>
                                            <button onClick={() => destroy(occ.id)} className="px-3 py-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg text-xs font-medium">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-sm">{modal === 'create' ? 'Add Gift Occasion' : 'Edit Gift Occasion'}</h3>
                            <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
                        </div>
                        <form onSubmit={saveOccasion} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Occasion Title *</label>
                                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Graduation & Achievements" className={inp} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug</label>
                                    <input type="text" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="e.g. graduation" className={inp} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Icon Name</label>
                                    <input type="text" value={form.icon || 'Gift'} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Cake, Heart, Sparkles" className={inp} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Banner Image URL</label>
                                <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inp} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                <textarea rows={2} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief occasion description..." className={`${inp} resize-none`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="occ_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded text-[#1933C6]" />
                                <label htmlFor="occ_active" className="text-xs text-gray-700 font-medium">Active (Visible in store)</label>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-medium text-white bg-[#1933C6] rounded-lg hover:bg-[#090087] shadow-sm disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Occasion'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
