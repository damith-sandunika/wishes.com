import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import { Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Award, Image as ImageIcon } from 'lucide-react';

export default function FreeItemsIndex() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const loadItems = () => {
        setLoading(true);
        axios.get('/api/free-items')
            .then(res => setItems(Array.isArray(res.data) ? res.data : []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this free item? Products attached will no longer show this item.')) return;
        try {
            await axios.delete(`/api/free-items/${id}`);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch {
            alert('Failed to delete free item.');
        }
    };

    const filtered = items.filter(i => (i.name || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout
            pageTitle="Free Items (Complimentary Gifts)"
            pageSubtitle="Manage free complimentary gifts included with specific products (e.g. Greeting Card, Keychain, Ribbon)."
            headerActions={
                <Link to="/admin/free-items/create" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all">
                    <Plus size={15} /> New Free Item
                </Link>
            }
        >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search free items..."
                            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Free Item</th>
                                <th className="py-3 px-4">Sort Order</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-400">Loading free items...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-400">No free items found. Click "New Free Item" to create one.</td></tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Award size={20} className="text-emerald-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">FREE</span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 line-clamp-1">{item.description || 'No description'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-slate-600">
                                            #{item.sort_order ?? 0}
                                        </td>
                                        <td className="py-3 px-4">
                                            {item.is_active ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    <XCircle size={12} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    to={`/admin/free-items/${item.id}/edit`}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit Free Item"
                                                >
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                    title="Delete Free Item"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
