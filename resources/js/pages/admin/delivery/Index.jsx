import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../layouts/AdminLayout';
import AdminStatusBadge from '../../../components/admin/AdminStatusBadge';
import axios from 'axios';
import { Plus, Pencil, Trash2, Truck, Clock, Search, MapPin } from 'lucide-react';

export default function DeliveryZonesIndex() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadZones = () => {
        setLoading(true);
        axios.get('/api/delivery-zones')
            .then(res => setZones(Array.isArray(res.data) ? res.data : []))
            .catch(() => setZones([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadZones(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this delivery zone?')) return;
        try {
            await axios.delete(`/api/delivery-zones/${id}`);
            setZones(prev => prev.filter(z => z.id !== id));
        } catch {
            alert('Failed to delete delivery zone.');
        }
    };

    const filtered = zones.filter(z =>
        z.name?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(z.districts) && z.districts.join(' ').toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <AdminLayout
            pageTitle="Delivery &amp; Shipping Rates"
            pageSubtitle="Configure regional delivery charges, estimated dispatch times, and free shipping thresholds."
            headerActions={
                <Link
                    to="/admin/delivery/create"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition"
                >
                    <Plus size={15} /> Add Delivery Zone
                </Link>
            }
        >
            <div className="w-full space-y-4">
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <Truck size={16} className="text-blue-600" />
                            <span>All Delivery Zones ({zones.length})</span>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search zones or areas..."
                                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                                <tr>
                                    <th className="px-5 py-3.5">Zone &amp; Duration</th>
                                    <th className="px-5 py-3.5">Covered Districts / Areas</th>
                                    <th className="px-5 py-3.5">Delivery Rate</th>
                                    <th className="px-5 py-3.5">Free Delivery Above</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">Loading delivery zones...</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400 font-semibold">No delivery zones found. Click "Add Delivery Zone" to create one.</td></tr>
                                ) : filtered.map(z => (
                                    <tr key={z.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                    <Truck size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-xs leading-tight">{z.name}</p>
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Clock size={11} /> {z.estimated_time || 'Standard duration'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 max-w-xs">
                                            <div className="flex items-center gap-1 text-[11px] text-slate-600">
                                                <MapPin size={12} className="text-slate-400 shrink-0" />
                                                <span className="truncate" title={Array.isArray(z.districts) ? z.districts.join(', ') : z.districts}>
                                                    {Array.isArray(z.districts) && z.districts.length > 0 ? z.districts.join(', ') : (z.districts || 'All Island')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-bold text-[#c8102e] text-xs">
                                            Rs. {Number(z.rate).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3.5 text-[11px]">
                                            {z.free_delivery_above ? (
                                                <span className="font-bold text-emerald-600">Over Rs. {Number(z.free_delivery_above).toLocaleString()}</span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AdminStatusBadge status={z.is_active ? 'Active' : 'Inactive'} />
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link to={`/admin/delivery/${z.id}/edit`} className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
                                                    <Pencil size={13} /> Edit
                                                </Link>
                                                <button onClick={() => handleDelete(z.id)} className="px-2.5 py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1">
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
            </div>
        </AdminLayout>
    );
}
