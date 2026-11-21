import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import ProductPricingSection from './ProductPricingSection';
import ProductCustomizationSection from './ProductCustomizationSection';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

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
        const fetchInitial = async () => {
            try {
                const [catRes, supRes] = await Promise.all([
                    axios.get('/api/categories').catch(() => ({ data: [] })),
                    axios.get('/api/suppliers').catch(() => ({ data: [] }))
                ]);
                const cats = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
                const sups = Array.isArray(supRes.data) ? supRes.data : (supRes.data?.data || []);
                setCategories(cats);
                setSuppliers(sups);

                if (isEdit) {
                    const prodRes = await axios.get(`/api/products/${id}`);
                    const p = prodRes.data.data || prodRes.data;
                    setForm({
                        ...EMPTY,
                        ...p,
                        name: p.name ?? '',
                        sku: p.sku ?? '',
                        category_id: p.category_id ?? '',
                        selling_price: p.selling_price ?? '',
                        discount_price: p.discount_price ?? '',
                        current_stock: p.current_stock ?? '',
                        unit_type: p.unit_type ?? 'piece',
                        status: p.status ?? 1,
                        short_description: p.short_description ?? '',
                        description: p.description ?? '',
                        supplier_id: p.supplier_id ?? '',
                        color_variations: Array.isArray(p.color_variations) ? p.color_variations : [],
                        allowed_addons: Array.isArray(p.allowed_addons) ? p.allowed_addons : ['card', 'teddy', 'ferrero', 'candle'],
                        occasions: Array.isArray(p.occasions) ? p.occasions : [],
                        images: Array.isArray(p.images) ? p.images : [],
                    });
                }
            } catch (_) {
                setError('Failed to load form prerequisites.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitial();
    }, [id, isEdit]);

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined && !['images', 'category', 'reviews', 'color_variations', 'allowed_addons', 'occasions'].includes(key)) {
                    let value = form[key];
                    if (typeof value === 'boolean') value = value ? 1 : 0;
                    formData.append(key, value);
                }
            });
            if (form.images && form.images.length > 0) formData.append('images', JSON.stringify(form.images));
            if (form.color_variations) formData.append('color_variations', JSON.stringify(form.color_variations));
            if (form.allowed_addons) formData.append('allowed_addons', JSON.stringify(form.allowed_addons));
            if (form.occasions) formData.append('occasions', JSON.stringify(form.occasions));
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
            const data = err.response?.data;
            const msg = data?.errors?.image?.[0]
                || (data?.errors && Object.values(data.errors).flat()[0])
                || data?.message
                || 'Error saving product';
            setError(msg);
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-blue-500 transition-all shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout
            pageTitle={isEdit ? 'Edit Gift Item' : 'New Gift Item'}
            pageSubtitle="Configure item identity, pricing variations, stock inventory, and options."
            headerActions={
                <Link to="/admin/products" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors">
                    <ArrowLeft size={14} /> Back to Catalog
                </Link>
            }
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
                {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">{error}</div>}
                
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-slate-400 font-semibold text-xs">Loading item configuration...</div>
                ) : (
                    <form onSubmit={save} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>Product Name *</label>
                                        <input required value={form.name ?? ''} onChange={e => setForm({...form, name: e.target.value})} className={inp} placeholder="e.g. Red Rose Bouquet" />
                                    </div>
                                    <div>
                                        <label className={label}>SKU Identifier *</label>
                                        <input required value={form.sku ?? ''} onChange={e => setForm({...form, sku: e.target.value})} className={inp} placeholder="e.g. WSH-FLW-001" />
                                    </div>
                                    <div>
                                        <label className={label}>Category *</label>
                                        <select required value={form.category_id ?? ''} onChange={e => setForm({...form, category_id: e.target.value})} className={inp}>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={label}>Supplier (Optional)</label>
                                        <select value={form.supplier_id ?? ''} onChange={e => setForm({...form, supplier_id: e.target.value})} className={inp}>
                                            <option value="">Select Supplier</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={label}>Primary Product Image</label>
                                        {form.images && form.images[0] && !imageFile && (
                                            <div className="mb-2 flex items-center gap-3">
                                                <img 
                                                    src={form.images[0].startsWith('http') ? form.images[0] : `/storage/${form.images[0].replace(/^\/?(storage\/)?/, '')}`} 
                                                    alt="Current" 
                                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200" 
                                                />
                                                <span className="text-[11px] text-slate-500 font-medium">Current primary photo</span>
                                            </div>
                                        )}
                                        <input 
                                            type="file" 
                                            accept={ACCEPT_IMAGE_ATTR} 
                                            onChange={e => {
                                                const f = e.target.files?.[0];
                                                if (f && validateImageFile(f).valid) setImageFile(f);
                                                else e.target.value = '';
                                            }} 
                                            className="w-full text-xs font-semibold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={label}>Short Catalog Tagline</label>
                                    <textarea rows={2} value={form.short_description ?? ''} onChange={e => setForm({...form, short_description: e.target.value})} className={`${inp} resize-none`} placeholder="Brief subtitle shown on gift card..." />
                                </div>
                                <div>
                                    <label className={label}>Full Product Description</label>
                                    <textarea rows={4} value={form.description ?? ''} onChange={e => setForm({...form, description: e.target.value})} className={`${inp} resize-none`} placeholder="Complete details, care instructions, and materials..." />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <ProductPricingSection form={form} setForm={setForm} label={label} inp={inp} />
                                <ProductCustomizationSection form={form} setForm={setForm} label={label} inp={inp} extraFiles={extraFiles} setExtraFiles={setExtraFiles} />
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link to="/admin/products" className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</Link>
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/25 active:scale-95">
                                <Save size={15} /> {saving ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
