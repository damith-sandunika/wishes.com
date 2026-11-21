import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../../../layouts/AdminLayout';
import { Save, Image as ImageIcon, Award } from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

export default function FreeItemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        setLoading(true);
        axios.get(`/api/free-items/${id}`)
            .then(res => {
                const a = res.data;
                setForm({
                    name: a.name || '',
                    description: a.description || '',
                    sort_order: a.sort_order || 0,
                    is_active: a.is_active !== false,
                });
                setImagePreview(a.image || '');
            })
            .catch(() => setError('Failed to load free item details.'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', form.description || '');
            fd.append('sort_order', form.sort_order);
            fd.append('is_active', form.is_active ? '1' : '0');
            if (imageFile) fd.append('image_file', imageFile);
            if (isEdit) fd.append('_method', 'PUT');

            await axios.post(isEdit ? `/api/free-items/${id}` : '/api/free-items', fd);
            navigate('/admin/free-items');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors && Object.values(data.errors).flat()[0]
                || data?.message || 'Failed to save free item.';
            setError(msg);
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-blue-600 transition-all shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout
            pageTitle={isEdit ? 'Edit Free Item' : 'New Free Item'}
            pageSubtitle="Configure complimentary gift details and photo."
        >
            <div className="w-full pb-12">
                {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">{error}</div>}

                {loading ? (
                    <div className="h-64 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading...</div>
                ) : (
                    <form onSubmit={save} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                        <div>
                            <label className={label}>Free Item Name <span className="text-red-500">*</span></label>
                            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Free Wax-Sealed Handwritten Card" className={inp} />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className={label}>Item Photo / Graphic</label>
                            <div className="flex items-center gap-4 p-3 bg-slate-50/60 rounded-xl border border-slate-200">
                                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Award size={24} className="text-emerald-500" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition shadow-2xs">
                                        {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                        <input type="file" accept={ACCEPT_IMAGE_ATTR} className="hidden"
                                            onChange={e => {
                                                const f = e.target.files?.[0];
                                                if (f && validateImageFile(f).valid) {
                                                    setImageFile(f);
                                                    setImagePreview(URL.createObjectURL(f));
                                                }
                                            }}
                                        />
                                    </label>
                                    <p className="text-[10px] text-slate-400">Square JPG, PNG or WebP image. Will appear on product card &amp; details.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Sort Order</label>
                                <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className={inp} />
                            </div>
                            <div>
                                <label className={label}>Status</label>
                                <select value={form.is_active ? 1 : 0} onChange={e => setForm({ ...form, is_active: Number(e.target.value) === 1 })} className={inp}>
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={label}>Short Description (Optional)</label>
                            <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="e.g. Beautifully penned message on Italian card stock included free with every order." className={`${inp} resize-none`} />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link to="/admin/free-items" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100">Cancel</Link>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25">
                                <Save size={15} /> {saving ? 'Saving...' : 'Save Free Item'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
