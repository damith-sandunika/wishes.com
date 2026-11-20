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
                .then(res => setForm(res.data))
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

    const inp = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-md text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1933C6]/20 focus:border-[#1933C6] transition-all shadow-sm";
    const label = "block text-[11px] font-normal text-slate-700 mb-2 uppercase tracking-widest";

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-md p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                        <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                        <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                        <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                        <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                    </div>
                    <div className="relative z-10">
                        <Link to="/admin/suppliers" className="inline-flex items-center gap-2 text-[10px] font-normal text-slate-400 hover:text-[#1933C6] uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft size={14} /> Back to Suppliers
                        </Link>
                        <h2 className="text-2xl font-normal text-slate-800 tracking-tight">
                            {isEdit ? 'Edit Supplier' : 'Add Supplier'}
                        </h2>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <form onSubmit={save} className="p-6 sm:p-8 space-y-8">
                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-normal border border-red-100">{error}</div>}
                        
                        {loading ? (
                            <div className="h-40 flex items-center justify-center text-gray-400 font-normal">Loading...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={label}>Supplier Name <span className="text-red-500">*</span></label>
                                        <input required autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inp} placeholder="Full Name" />
                                    </div>
                                    <div>
                                        <label className={label}>Company</label>
                                        <input value={form.company || ''} onChange={e => setForm({...form, company: e.target.value})} className={inp} placeholder="Company Name" />
                                    </div>
                                    <div>
                                        <label className={label}>Phone Number <span className="text-red-500">*</span></label>
                                        <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inp} placeholder="07XXXXXXXX" />
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

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <Link to="/admin/suppliers" className="px-6 py-2.5 rounded-md text-slate-600 text-[11px] uppercase tracking-widest font-normal hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">Cancel</Link>
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-md bg-[#1933C6] hover:bg-[#090087] text-white text-[11px] font-normal uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2">
                                        <Save size={16} strokeWidth={2.5} /> {saving ? 'Saving...' : 'Save Supplier'}
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
