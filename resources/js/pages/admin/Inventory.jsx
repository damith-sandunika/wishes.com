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
            setProducts(prodRes.data.data || prodRes.data);
            setSuppliers(supRes.data.data || supRes.data);
            
            const allProds = prodRes.data.data || prodRes.data;
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleRestockChange = (id, field, value) => {
        setRestockData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
        // Auto-select row if they type a quantity
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
        
        if (toRestock.length === 0) {
            return alert("Please enter quantities for the selected products.");
        }

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
        } catch (err) {
            alert('Failed to restock some items. Please check again.');
            fetchData();
        }
    };

    return (
        <AdminLayout>
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Inventory Management</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">Bulk Restock & Monitor</p>
                </div>
            </div>

            {/* Mobile & Desktop Action Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-xs font-normal text-slate-500 uppercase tracking-wider">Global Supplier:</label>
                    <select 
                        className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#1933C6] focus:border-[#1933C6] outline-none"
                        value={globalSupplier}
                        onChange={e => setGlobalSupplier(e.target.value)}
                    >
                        <option value="">-- Apply to All Selected --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <span className="text-sm font-normal text-slate-700 sm:hidden">{selectedIds.length} Selected</span>
                    <button 
                        onClick={submitBulkRestock}
                        disabled={selectedIds.length === 0}
                        className="bg-[#1933C6] hover:bg-[#090087] text-white px-6 py-2.5 rounded-md text-[11px] font-normal uppercase tracking-widest shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                    >
                        <PackagePlus size={16} />
                        Restock ({selectedIds.length})
                    </button>
                </div>
            </div>

            {expiring.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
                    <h3 className="text-red-800 font-normal flex items-center gap-2 mb-3 text-sm">
                        <AlertCircle size={18} /> Expiring Soon (Within 30 Days)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {expiring.map(p => (
                            <div key={p.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="font-normal text-slate-800 text-sm">{p.name}</p>
                                    <p className="text-xs text-red-500 font-normal mt-0.5">Expires: {new Date(p.expiry_date).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-normal">{p.current_stock}</span>
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
