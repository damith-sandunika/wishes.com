import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const EMPTY = { name: '', company: '', phone: '', whatsapp_number: '', email: '', address: '', city: '', notes: '', status: 1 };

export default function SupplierForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            axios.get(`/api/suppliers/${id}`)
                .then(res => {
                    const data = res.data.data || res.data;
                    setForm({
                        ...EMPTY,
                        ...data,
                        name: data.name ?? '',
                        company: data.company ?? '',
                        phone: data.phone ?? '',
                        whatsapp_number: data.whatsapp_number ?? '',
                        email: data.email ?? '',
                        address: data.address ?? '',
                        city: data.city ?? '',
                        notes: data.notes ?? '',
                        status: data.status ? 1 : 0,
                    });
                })
                .catch(() => setError('Supplier not found'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEdit) {
                await axios.put(`/api/suppliers/${id}`, form);
            } else {
                await axios.post('/api/suppliers', form);
            }
            navigate('/admin/suppliers');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving supplier');
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition shadow-2xs";
    const label = "block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout
            pageTitle={isEdit ? 'Edit Supplier' : 'Add Supplier'}
            pageSubtitle="Save vendor profile and contact information"
            headerActions={
                <Link to="/admin/suppliers" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100 transition border border-slate-200">
                    <ArrowLeft size={14} /> Back
                </Link>
            }
        >
            <div className="max-w-4xl mx-auto">

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <form onSubmit={save} className="p-6 space-y-6">
                        {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium border border-rose-200">{error}</div>}
                        
                        {loading ? (
                            <div className="h-40 flex items-center justify-center text-slate-400">Loading...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className={label}>Supplier Name <span className="text-rose-500">*</span></label>
                                        <input required autoFocus value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className={inp} placeholder="Full Name" />
                                    </div>
                                    <div>
                                        <label className={label}>Company</label>
                                        <input value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} className={inp} placeholder="Company Name" />
                                    </div>
                                    <div>
                                        <label className={label}>Phone Number <span className="text-rose-500">*</span></label>
                                        <input required value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} className={inp} placeholder="07XXXXXXXX" />
                                    </div>
                                    <div>
                                        <label className={label}>WhatsApp Number</label>
                                        <input value={form.whatsapp_number || ''} onChange={e => setForm({...form, whatsapp_number: e.target.value})} className={inp} placeholder="Optional" />
                                    </div>
                                    <div>
                                        <label className={label}>Email Address</label>
                                        <input type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} className={inp} placeholder="supplier@example.com" />
                                    </div>
                                    <div>
                                        <label className={label}>City</label>
                                        <input value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} className={inp} placeholder="e.g. Colombo" />
                                    </div>
                                </div>

                                <div>
                                    <label className={label}>Full Address</label>
                                    <textarea rows={2} value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} className={`${inp} resize-none`} />
                                </div>

                                <div>
                                    <label className={label}>Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: Number(e.target.value)})} className={inp}>
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <Link to="/admin/suppliers" className="px-4 py-2 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100 transition">Cancel</Link>
                                    <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition flex items-center gap-1.5">
                                        <Save size={15} /> {saving ? 'Saving...' : 'Save Supplier'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
