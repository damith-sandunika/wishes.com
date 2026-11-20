import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import ProductPricingSection from './ProductPricingSection';
import ProductCustomizationSection from './ProductCustomizationSection';

const EMPTY = { name: '', sku: '', category_id: '', selling_price: '', discount_price: '', current_stock: '', unit_type: 'piece', status: 1, short_description: '', description: '', supplier_id: '', enable_personalization: false, enable_wrapping: true, color_variations: [], allowed_addons: ['card', 'teddy', 'ferrero', 'candle'] };

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [extraFiles, setExtraFiles] = useState([null, null, null]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, supRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/suppliers')
                ]);
                setCategories(catRes.data.data || catRes.data);
                setSuppliers(supRes.data.data || supRes.data);

                if (isEdit) {
                    const prodRes = await axios.get(`/api/products/${id}`);
                    setForm(prodRes.data);
                }
            } catch (err) {
                setError('Error loading form data');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined && !['images', 'category', 'color_variations', 'allowed_addons'].includes(key)) {
                    let value = form[key];
                    if (typeof value === 'boolean') value = value ? 1 : 0;
                    formData.append(key, value);
                }
            });
            if (form.color_variations) formData.append('color_variations', JSON.stringify(form.color_variations));
            if (form.allowed_addons) formData.append('allowed_addons', JSON.stringify(form.allowed_addons));
            if (imageFile) formData.append('image', imageFile);
            extraFiles.forEach(f => { if (f) formData.append('extra_images[]', f); });

            if (isEdit) {
                formData.append('_method', 'PUT');
                await axios.post(`/api/products/${id}`, formData);
            } else {
                await axios.post('/api/products', formData);
            }
            navigate('/admin/products');
        } catch (err) {
            console.error(err.response?.data);
            const errorMsg = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(', ')
                : (err.response?.data?.message || 'Error saving product');
            setError(errorMsg);
            setSaving(false);
        }
    };

    const inp = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-md text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1933C6]/20 focus:border-[#1933C6] transition-all shadow-sm";
    const label = "block text-[11px] font-normal text-slate-700 mb-2 uppercase tracking-widest";

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6 bg-white rounded-md p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                        <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                        <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                        <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                        <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                    </div>
                    <div className="relative z-10">
                        <Link to="/admin/products" className="inline-flex items-center gap-2 text-[10px] font-normal text-slate-400 hover:text-[#1933C6] uppercase tracking-widest transition-colors mb-2">
                            <ArrowLeft size={14} /> Back to Products
                        </Link>
                        <h2 className="text-2xl font-normal text-slate-800 tracking-tight">
                            {isEdit ? 'Edit Product' : 'Add Product'}
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
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className={label}>Product Name <span className="text-red-500">*</span></label>
                                                <input required autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inp} placeholder="e.g. Fresh Tomatoes" />
                                            </div>
                                            <div>
                                                <label className={label}>SKU <span className="text-red-500">*</span></label>
                                                <input required value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className={inp} placeholder="e.g. TOM-001" />
                                            </div>
                                            <div>
                                                <label className={label}>Category <span className="text-red-500">*</span></label>
                                                <select required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className={inp}>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={label}>Supplier (Optional)</label>
                                                <select value={form.supplier_id || ''} onChange={e => setForm({...form, supplier_id: e.target.value})} className={inp}>
                                                    <option value="">Select Supplier</option>
                                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className={label}>Product Image</label>
                                                <div className="flex items-center gap-4">
                                                    {form.images && form.images.length > 0 && !imageFile && (
                                                        <img src={`/storage/${form.images[0]}`} alt="Current" className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={e => setImageFile(e.target.files[0])} 
                                                        className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-md text-sm font-normal focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-normal file:uppercase file:tracking-widest file:bg-blue-50 file:text-[#1933C6] hover:file:bg-blue-100 transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={label}>Short Description (Optional)</label>
                                            <textarea rows={2} value={form.short_description || ''} onChange={e => setForm({...form, short_description: e.target.value})} className={`${inp} resize-none`} placeholder="Brief summary for catalog view..." />
                                        </div>

                                        <div>
                                            <label className={label}>Full Description (Optional)</label>
                                            <textarea rows={5} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} className={`${inp} resize-none`} placeholder="Detailed product description..." />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <ProductPricingSection form={form} setForm={setForm} label={label} inp={inp} />
                                        <ProductCustomizationSection form={form} setForm={setForm} label={label} inp={inp} extraFiles={extraFiles} setExtraFiles={setExtraFiles} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <Link to="/admin/products" className="px-6 py-2.5 rounded-md text-slate-600 text-[11px] uppercase tracking-widest font-normal hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">Cancel</Link>
                                    <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-md bg-[#1933C6] hover:bg-[#090087] text-white text-[11px] font-normal uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2">
                                        <Save size={16} strokeWidth={2.5} /> {saving ? 'Saving...' : 'Save Product'}
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
