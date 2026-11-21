import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Gift, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import AddonModal from './AddonModal';

export default function AddonIndex() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddon, setSelectedAddon] = useState(null);

    const loadAddons = () => {
        setLoading(true);
        axios.get('/api/addons')
            .then(res => setAddons(Array.isArray(res.data) ? res.data : []))
            .catch(() => setAddons([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadAddons(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this addon?')) return;
        try {
            await axios.delete(`/api/addons/${id}`);
            loadAddons();
        } catch {
            alert('Failed to delete addon.');
        }
    };

    const filtered = addons.filter(item => {
        const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'all' || item.type === activeTab;
        return matchSearch && matchTab;
    });

    const counts = {
        all: addons.length,
        addon: addons.filter(a => a.type === 'addon').length,
        personalization: addons.filter(a => a.type === 'personalization').length,
    };

    return (
        <AdminLayout
            pageTitle="Personalization & Add-ons"
            pageSubtitle="Configure gift accessories, wrapping options, and custom engraving / card items"
            headerActions={
                <button onClick={() => { setSelectedAddon(null); setIsModalOpen(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
                    <Plus size={16} /> Add Addon / Personalization
                </button>
            }
        >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Search & Tabs Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        {['all', 'addon', 'personalization'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    activeTab === tab ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-100'
                                }`}>
                                {tab === 'all' ? `All Items (${counts.all})` : tab === 'addon' ? `Gift Add-ons (${counts.addon})` : `Personalizations (${counts.personalization})`}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search add-ons..." className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white" />
                    </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Item</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Default Price</th>
                                <th className="py-3 px-4">Pricing Policy</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading add-ons...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-slate-400">No add-ons found.</td></tr>
                            ) : (
                                filtered.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xl">{item.icon || '🎁'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                                        <span>{item.name}</span>
                                                        <span className="text-sm">{item.icon}</span>
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                item.type === 'personalization' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                                {item.type === 'personalization' ? <Sparkles size={11} /> : <Gift size={11} />}
                                                {item.type === 'personalization' ? 'Personalization' : 'Add-on'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-800">
                                            Rs. {Number(item.price || 0).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            {item.is_price_editable ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 size={11} /> Editable per Product
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                                                    Fixed Price
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => { setSelectedAddon(item); setIsModalOpen(true); }}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
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

            <AddonModal
                isOpen={isModalOpen}
                addon={selectedAddon}
                onClose={() => { setIsModalOpen(false); setSelectedAddon(null); }}
                onSaved={loadAddons}
            />
        </AdminLayout>
    );
}
