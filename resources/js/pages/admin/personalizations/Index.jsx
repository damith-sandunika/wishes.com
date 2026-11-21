import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';

export default function PersonalizationIndex() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadItems = () => {
        setLoading(true);
        axios.get('/api/addons')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                setItems(list.filter(item => item.type === 'personalization'));
            })
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadItems(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this customized item option?')) return;
        try {
            await axios.delete(`/api/addons/${id}`);
            loadItems();
        } catch {
            alert('Failed to delete customized item.');
        }
    };

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout
            pageTitle="Customized Items"
            pageSubtitle="Manage greeting cards, customized photo gifts, engraved items, and custom options."
            headerActions={
                <Link
                    to="/admin/personalizations/create"
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                >
                    <Plus size={16} /> New Customized Item
                </Link>
            }
        >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <Sparkles size={16} className="text-purple-600" />
                        <span>All Customized Items ({items.length})</span>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search customized items..."
                            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-purple-500 bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Item</th>
                                <th className="py-3 px-4">Default Price</th>
                                <th className="py-3 px-4">Pricing Policy</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10 text-slate-400">Loading customized items...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10 text-slate-400">No customized items found. Click "New Customized Item" to create one.</td></tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {(item.image || item.options?.[0]?.image) ? (
                                                        <img src={item.image || item.options?.[0]?.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg">{item.icon || '✨'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-slate-800 text-xs">{item.name}</span>
                                                        {Array.isArray(item.options) && item.options.length > 0 && (
                                                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                                                                {item.options.length} style{item.options.length > 1 ? 's' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 line-clamp-1">{item.description || 'No description'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-800">
                                            Rs. {Number(item.price || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.is_price_editable ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {item.is_price_editable ? 'Per-product customizable' : 'Fixed standard'}
                                            </span>
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
                                                    to={`/admin/personalizations/${item.id}/edit`}
                                                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                    title="Edit Customized Item"
                                                >
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                                    title="Delete Customized Item"
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
