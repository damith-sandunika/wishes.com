import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProductsReportTab() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/reports/products')
            .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400 text-xs">Loading product analytics...</div>;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">
                Gift Product Performance & Stock Status
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Units Sold</th>
                            <th className="px-4 py-3">Revenue Generated</th>
                            <th className="px-4 py-3 text-right">Current Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.length > 0 ? (
                            products.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-500">{p.category}</td>
                                    <td className="px-4 py-3 text-slate-700">Rs. {Number(p.price).toLocaleString()}</td>
                                    <td className="px-4 py-3 font-semibold text-blue-700">{p.units_sold} units</td>
                                    <td className="px-4 py-3 font-bold text-emerald-600">Rs. {Number(p.revenue).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{p.current_stock}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-8 text-center text-slate-400">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
