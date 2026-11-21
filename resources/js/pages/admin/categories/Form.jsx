import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

const EMPTY = { name: '', description: '', status: 1, sort_order: 0, image: null };

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            axios.get(`/api/categories/${id}`)
                .then(res => {
                    const data = res.data.data || res.data;
                    setForm({
                        ...EMPTY,
                        ...data,
                        name: data.name ?? '',
                        description: data.description ?? '',
                        sort_order: data.sort_order ?? 0,
                        status: data.status ? 1 : 0,
                    });
                    if (data.image) {
                        setPreviewUrl(data.image.startsWith('http') ? data.image : `/storage/${data.image.replace(/^\/?(storage\/)?/, '')}`);
                    }
                })
                .catch(() => setError('Category not found'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const check = validateImageFile(file);
        if (!check.valid) {
            e.target.value = '';
            return;
        }
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('status', form.status ? 1 : 0);
            formData.append('sort_order', form.sort_order || 0);
            if (form.description) formData.append('description', form.description);
            if (imageFile) formData.append('image', imageFile);

            if (isEdit) {
                formData.append('_method', 'PUT');
                await axios.post(`/api/categories/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/api/categories', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/categories');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors?.image?.[0]
                || (data?.errors && Object.values(data.errors).flat()[0])
                || data?.message
                || 'Error saving category';
            setError(msg);
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-blue-500 transition-all shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout
            pageTitle={isEdit ? 'Edit Category' : 'Create Category'}
            pageSubtitle="Define title, descriptive banner, and hierarchy for gift grouping."
            headerActions={
                <Link to="/admin/categories" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors">
                    <ArrowLeft size={14} /> Back to Categories
                </Link>
            }
        >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 w-full">
                {error && <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">{error}</div>}
                
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading category...</div>
                ) : (
                    <form onSubmit={save} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={label}>Category Name *</label>
                                <input required value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className={inp} placeholder="e.g. Birthday Flowers" />
                            </div>
                            <div>
                                <label className={label}>Visibility Status</label>
                                <select value={form.status ? 1 : 0} onChange={e => setForm({...form, status: Number(e.target.value) === 1})} className={inp}>
                                    <option value={1}>Active / Visible in Store</option>
                                    <option value={0}>Inactive / Hidden</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={label}>Description (Optional)</label>
                            <textarea rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className={`${inp} resize-none`} placeholder="Brief description of gifts in this collection..." />
                        </div>

                        <div>
                            <label className={label}>Category Image</label>
                            {previewUrl && (
                                <div className="mb-2 relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                                    <img 
                                        src={previewUrl.startsWith('http') || previewUrl.startsWith('blob:') ? previewUrl : `/storage/${previewUrl.replace(/^\/?(storage\/)?/, '')}`} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}
                            <input type="file" accept={ACCEPT_IMAGE_ATTR} onChange={handleFileChange} className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link to="/admin/categories" className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</Link>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 active:scale-95">
                                <Save size={15} /> {saving ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
