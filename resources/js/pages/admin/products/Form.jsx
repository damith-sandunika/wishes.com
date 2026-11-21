import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import ProductBasicInfoSection from './ProductBasicInfoSection';
import ProductPricingSection from './ProductPricingSection';
import ProductMediaSection from './ProductMediaSection';
import ProductCustomizationSection from './ProductCustomizationSection';
import ProductFreeItemsSection from './ProductFreeItemsSection';
import ProductOccasionsSection from './ProductOccasionsSection';

const parseField = (val, fb = []) => {
    if (!val) return fb;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') { try { return JSON.parse(val); } catch { return fb; } }
    return fb;
};

const makeSku = () => 'WSH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

const EMPTY = {
    name: '', sku: makeSku(), category_id: '', selling_price: '', discount_price: '',
    current_stock: '', unit_type: 'piece', status: 1, short_description: '',
    description: '', supplier_id: '', enable_personalization: false, enable_wrapping: true,
    color_variations: [], allowed_addons: [], free_items: [], occasions: [], images: [],
};

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null), [extraFiles, setExtraFiles] = useState([null, null]), [colorFiles, setColorFiles] = useState({});
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
                setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []));
                setSuppliers(Array.isArray(supRes.data) ? supRes.data : (supRes.data?.data || []));

                if (isEdit) {
                    const prodRes = await axios.get(`/api/products/${id}`);
                    const p = prodRes.data.data || prodRes.data || {};
                    setForm({
                        ...EMPTY,
                        ...p,
                        name: p.name ?? '',
                        sku: p.sku || makeSku(),
                        category_id: p.category_id ? String(p.category_id) : '',
                        supplier_id: p.supplier_id ? String(p.supplier_id) : '',
                        selling_price: p.selling_price ?? '',
                        discount_price: p.discount_price ?? '',
                        current_stock: p.current_stock ?? '',
                        unit_type: p.unit_type ?? 'piece',
                        status: p.status !== undefined && p.status !== null ? Number(p.status) : 1,
                        short_description: p.short_description ?? '',
                        description: p.description ?? '',
                        enable_personalization: Boolean(p.enable_personalization),
                        enable_wrapping: p.enable_wrapping !== undefined ? Boolean(p.enable_wrapping) : true,
                        color_variations: parseField(p.color_variations),
                        allowed_addons: parseField(p.allowed_addons),
                        free_items: parseField(p.free_items),
                        occasions: parseField(p.occasions),
                        images: parseField(p.images),
                    });
                }
            } catch (_) {
                setError('Failed to load item configuration from server.');
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
            const excludeKeys = ['images', 'category', 'reviews', 'color_variations', 'allowed_addons', 'free_items', 'occasions'];
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined && !excludeKeys.includes(key)) {
                    let val = form[key];
                    if (typeof val === 'boolean') val = val ? 1 : 0;
                    formData.append(key, val);
                }
            });
            formData.append('images', JSON.stringify(form.images || []));
            formData.append('color_variations', JSON.stringify(form.color_variations || []));
            formData.append('allowed_addons', JSON.stringify(form.allowed_addons || []));
            formData.append('free_items', JSON.stringify(form.free_items || []));
            formData.append('occasions', JSON.stringify(form.occasions || []));
            if (imageFile) formData.append('image', imageFile);
            extraFiles.forEach(f => { if (f) formData.append('extra_images[]', f); });
            Object.keys(colorFiles).forEach(i => { if (colorFiles[i]) formData.append(`color_image_${i}`, colorFiles[i]); });
            if (isEdit) {
                formData.append('_method', 'PUT');
                await axios.post(`/api/products/${id}`, formData);
            } else {
                await axios.post('/api/products', formData);
            }
            navigate('/admin/products');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors?.image?.[0] || (data?.errors && Object.values(data.errors).flat()[0]) || data?.message || 'Error saving product configuration';
            setError(msg);
            setSaving(false);
        }
    };

    const inp = "w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-blue-600 transition-all shadow-2xs";
    const label = "block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider";

    return (
        <AdminLayout
            pageTitle={isEdit ? 'Edit Gift Catalog Item' : 'New Gift Catalog Item'}
            pageSubtitle="Configure item identity, pricing variations, multi-angle images, add-ons, and occasions."
            headerActions={
                <button type="button" onClick={() => document.getElementById('product-form')?.requestSubmit()} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/25 transition-all active:scale-95">
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Product'}
                </button>
            }
        >
            <div className="w-full pb-12">
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold shadow-2xs">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="h-64 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-xs">
                        Loading item configuration...
                    </div>
                ) : (
                    <form id="product-form" onSubmit={save} className="space-y-6">
                        <ProductBasicInfoSection form={form} setForm={setForm} categories={categories} suppliers={suppliers} label={label} inp={inp} />
                        <ProductPricingSection form={form} setForm={setForm} label={label} inp={inp} />
                        <ProductMediaSection form={form} imageFile={imageFile} setImageFile={setImageFile} extraFiles={extraFiles} setExtraFiles={setExtraFiles} label={label} />
                        <ProductCustomizationSection form={form} setForm={setForm} colorFiles={colorFiles} setColorFiles={setColorFiles} label={label} inp={inp} />
                        <ProductFreeItemsSection form={form} setForm={setForm} />
                        <ProductOccasionsSection form={form} setForm={setForm} />

                        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                                Make sure all required fields marked with * are filled before saving.
                            </span>
                            <div className="flex items-center gap-3 ml-auto">
                                <Link to="/admin/products" className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 active:scale-95"
                                >
                                    <Save size={15} /> {saving ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
