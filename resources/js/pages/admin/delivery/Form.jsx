import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import { Save, Truck } from 'lucide-react';

export default function DeliveryZoneForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '', rate: '', estimated_time: '', districts: '',
        free_delivery_above: '', description: '', is_active: true
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        setLoading(true);
        axios.get(`/api/delivery-zones/${id}`)
            .then(res => {
                const z = res.data;
                setForm({
                    name: z.name || '',
                    rate: z.rate ?? '',
                    estimated_time: z.estimated_time || '',
                    districts: Array.isArray(z.districts) ? z.districts.join(', ') : (z.districts || ''),
                    free_delivery_above: z.free_delivery_above ?? '',
                    description: z.description || '',
                    is_active: z.is_active !== false,
                });
            })
            .catch(() => setError('Failed to load delivery zone details.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                rate: Number(form.rate),
                free_delivery_above: form.free_delivery_above !== '' ? Number(form.free_delivery_above) : null,
                districts: form.districts ? form.districts.split(',').map(s => s.trim()).filter(Boolean) : [],
            };
            if (isEdit) {
                await axios.put(`/api/delivery-zones/${id}`, payload);
            } else {
                await axios.post('/api/delivery-zones', payload);
            }
            navigate('/admin/delivery');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save delivery zone.');
            setSaving(false);
        }
    };

    const inp = "w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-blue-600 font-semibold shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5";

    return (
        <AdminLayout
            pageTitle={isEdit ? `Edit: ${form.name || 'Delivery Zone'}` : 'New Delivery Zone'}
            pageSubtitle="Configure shipping fees, regional districts covered, and delivery dispatch duration."
        >
            <div className="w-full pb-12">
                {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">{error}</div>}

                {loading ? (
                    <div className="h-64 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading zone...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Truck size={18} /></span>
                            <h3 className="font-bold text-slate-900 text-sm">Zone Information &amp; Pricing</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Zone Name <span className="text-red-500">*</span></label>
                                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Colombo City & Suburbs" className={inp} />
                            </div>
                            <div>
                                <label className={label}>Delivery Fee (LKR) <span className="text-red-500">*</span></label>
                                <input required type="number" min="0" step="0.01" value={form.rate}
                                    onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="350" className={inp} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Estimated Duration</label>
                                <input value={form.estimated_time} onChange={e => setForm({ ...form, estimated_time: e.target.value })}
                                    placeholder="e.g. Same Day (2 – 4 Hours)" className={inp} />
                            </div>
                            <div>
                                <label className={label}>Free Delivery For Orders Above (Rs)</label>
                                <input type="number" min="0" value={form.free_delivery_above}
                                    onChange={e => setForm({ ...form, free_delivery_above: e.target.value })}
                                    placeholder="e.g. 7500 (Leave empty if none)" className={inp} />
                            </div>
                        </div>

                        <div>
                            <label className={label}>Covered Districts / Areas (Comma-separated)</label>
                            <input value={form.districts} onChange={e => setForm({ ...form, districts: e.target.value })}
                                placeholder="e.g. Colombo, Dehiwala, Mount Lavinia, Rajagiriya" className={inp} />
                            <p className="text-[10px] text-slate-400 mt-1">Specify district names (e.g. Colombo, Gampaha, Kalutara) or specific postal towns.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Status</label>
                                <select value={form.is_active ? 1 : 0} onChange={e => setForm({ ...form, is_active: Number(e.target.value) === 1 })} className={inp}>
                                    <option value={1}>Active (Available on Checkout)</option>
                                    <option value={0}>Inactive (Disabled)</option>
                                </select>
                            </div>
                            <div>
                                <label className={label}>Description / Internal Note</label>
                                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g. Fast local courier dispatch route" className={inp} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link to="/admin/delivery" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition">Cancel</Link>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition">
                                <Save size={15} /> {saving ? 'Saving...' : (isEdit ? 'Update Zone' : 'Create Delivery Zone')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
