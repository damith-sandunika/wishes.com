import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';
import { AlertCircle, PackagePlus } from 'lucide-react';
import InventoryTable from './inventory/InventoryTable';

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(true);

    const [restockData, setRestockData] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [globalSupplier, setGlobalSupplier] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, supRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/suppliers'),
            ]);
            const allProds = Array.isArray(prodRes.data) 
                ? prodRes.data 
                : (Array.isArray(prodRes.data?.data) ? prodRes.data.data : []);
            const allSups = Array.isArray(supRes.data) 
                ? supRes.data 
                : (Array.isArray(supRes.data?.data) ? supRes.data.data : []);
            setProducts(allProds);
            setSuppliers(allSups);
            
            const now = new Date();
            const exp = allProds.filter(p => {
                if (!p.expiry_date) return false;
                const pDate = new Date(p.expiry_date);
                const diffTime = pDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 30 && diffDays >= -30;
            });
            setExpiring(exp);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleRestockChange = (id, field, value) => {
        setRestockData(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
        if (field === 'quantity' && value && !selectedIds.includes(id)) {
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleCheck = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleCheckAll = () => {
        if (selectedIds.length === products.length) setSelectedIds([]);
        else setSelectedIds(products.map(p => p.id));
    };

    const submitBulkRestock = async () => {
        const toRestock = selectedIds.filter(id => restockData[id]?.quantity > 0);
        if (toRestock.length === 0) return alert("Please enter quantities for the selected products.");

        setLoading(true);
        try {
            await Promise.all(toRestock.map(id => {
                const data = restockData[id];
                const prod = products.find(p => p.id === id);
                return axios.post('/api/stock-logs', {
                    product_id: id,
                    type: 'restock',
                    quantity: data.quantity,
                    supplier_id: data.supplier_id || globalSupplier || null,
                    expiry_date: data.expiry_date || prod?.expiry_date || null,
                    notes: 'Bulk Restocked via Admin'
                });
            }));
            setRestockData({});
            setSelectedIds([]);
            fetchData();
            alert("Bulk restock completed successfully!");
        } catch {
            alert('Failed to restock some items. Please check again.');
            fetchData();
        }
    };

    return (
        <AdminLayout
            pageTitle="Inventory Management"
            pageSubtitle="Bulk restock catalog items and track expiration dates"
            headerActions={
                <button 
                    onClick={submitBulkRestock}
                    disabled={selectedIds.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PackagePlus size={16} /> Restock Selected ({selectedIds.length})
                </button>
            }
        >

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Global Supplier:</label>
                    <select 
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                        value={globalSupplier}
                        onChange={e => setGlobalSupplier(e.target.value)}
                    >
                        <option value="">-- Apply to All Selected --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <span className="text-xs font-medium text-slate-500">
                    {selectedIds.length} of {products.length} products selected
                </span>
            </div>

            {expiring.length > 0 && (
                <div className="mb-6 bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-xs">
                    <h3 className="text-rose-800 font-bold flex items-center gap-2 mb-3 text-xs uppercase tracking-wider">
                        <AlertCircle size={16} /> Expiring Soon (Within 30 Days)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {expiring.map(p => (
                            <div key={p.id} className="bg-white p-3 rounded-lg border border-rose-100 shadow-xs flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800 text-xs">{p.name}</p>
                                    <p className="text-[11px] text-rose-500 font-medium mt-0.5">Expires: {new Date(p.expiry_date).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold">{p.current_stock}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <InventoryTable 
                products={products}
                suppliers={suppliers}
                selectedIds={selectedIds}
                restockData={restockData}
                handleCheckAll={handleCheckAll}
                handleCheck={handleCheck}
                handleRestockChange={handleRestockChange}
                globalSupplier={globalSupplier}
                loading={loading}
            />
        </AdminLayout>
    );
}
