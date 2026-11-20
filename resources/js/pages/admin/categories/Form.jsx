import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const EMPTY = { name: '', description: '', status: 1 };

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            axios.get(`/api/categories/${id}`)
                .then(res => setForm(res.data))
                .catch(() => setError('Category not found'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null) {
                    let value = form[key];
                    if (typeof value === 'boolean') {
                        value = value ? 1 : 0;
                    }
                    formData.append(key, value);
                }
            });
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit) {
                formData.append('_method', 'PUT');
                await axios.post(`/api/categories/${id}`, formData);
            } else {
                await axios.post('/api/categories', formData);
            }
            navigate('/admin/categories');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving category');
            setSaving(false);
        }
    };

    const inp = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-md text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1933C6]/20 focus:border-[#1933C6] transition-all shadow-sm";
    const label = "block text-[11px] font-normal text-slate-700 mb-2 uppercase tracking-widest";

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-md p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                        <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                        <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                        <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                        <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                    </div>
                    <div className="relative z-10">
                        <Link to="/admin/categories" className="inline-flex items-center gap-2 text-[10px] font-normal text-slate-400 hover:text-[#1933C6] uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft size={14} /> Back to Categories
                        </Link>
                        <h2 className="text-2xl font-normal text-slate-800 tracking-tight">
                            {isEdit ? 'Edit Category' : 'Create Category'}
                        </h2>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <form onSubmit={save} className="p-6 sm:p-8 space-y-6">
                        {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-normal border border-red-100">{error}</div>}
                        
                        {loading ? (
                            <div className="h-40 flex items-center justify-center text-gray-400 font-normal">Loading...</div>
                        ) : (
                            <>
                                <div>
                                    <label className={label}>Category Name <span className="text-red-500">*</span></label>
                                    <input 
                                        required 
                                        autoFocus
                                        value={form.name} 
                                        onChange={e => setForm({...form, name: e.target.value})} 
                                        className={inp} 
                                        placeholder="e.g. Vegetables"
                                    />
                                </div>

                                <div>
                                    <label className={label}>Category Image</label>
                                    <div className="flex items-center gap-4">
                                        {form.image && !imageFile && (
                                            <img src={`/storage/${form.image}`} alt="Current" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={e => setImageFile(e.target.files[0])} 
                                            className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-md text-sm font-normal focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-normal file:uppercase file:tracking-widest file:bg-blue-50 file:text-[#1933C6] hover:file:bg-blue-100 transition-all" 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={label}>Description</label>
                                    <textarea 
                                        rows={4} 
                                        value={form.description || ''} 
                                        onChange={e => setForm({...form, description: e.target.value})} 
                                        className={`${inp} resize-none`} 
                                        placeholder="Optional details about this category..."
                                    />
                                </div>

                                <div>
                                    <label className={label}>Status</label>
                                    <select 
                                        value={form.status} 
                                        onChange={e => setForm({...form, status: Number(e.target.value)})} 
                                        className={inp}
                                    >
                                        <option value={1}>Active (Visible to customers)</option>
                                        <option value={0}>Inactive (Hidden)</option>
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <Link to="/admin/categories" className="px-6 py-2.5 rounded-md text-slate-600 text-[11px] uppercase tracking-widest font-normal hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                                        Cancel
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={saving} 
                                        className="px-6 py-2.5 rounded-md bg-[#1933C6] hover:bg-[#090087] text-white text-[11px] font-normal uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100" 
                                    >
                                        <Save size={16} strokeWidth={2.5} /> {saving ? 'Saving...' : 'Save Category'}
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
