import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export default function InventoryTable({ 
    products, 
    suppliers, 
    selectedIds, 
    restockData, 
    handleCheckAll, 
    handleCheck, 
    handleRestockChange, 
    globalSupplier, 
    loading 
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3.5 cursor-pointer w-12" onClick={handleCheckAll}>
                                {selectedIds.length > 0 && selectedIds.length === products.length ? <CheckSquare size={17} className="text-blue-600"/> : <Square size={17} />}
                            </th>
                            <th className="px-5 py-3.5 font-semibold">Product Details</th>
                            <th className="px-5 py-3.5 font-semibold">Current Stock</th>
                            <th className="px-5 py-3.5 font-semibold">Restock Qty</th>
                            <th className="px-5 py-3.5 font-semibold">Supplier (Override)</th>
                            <th className="px-5 py-3.5 text-right font-semibold">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-8 text-slate-400">Loading inventory items...</td></tr>
                        ) : products.map(p => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'}`}>
                                    <td className="px-5 py-3 cursor-pointer" onClick={() => handleCheck(p.id)}>
                                        {isSelected ? <CheckSquare size={17} className="text-blue-600"/> : <Square size={17} className="text-slate-300"/>}
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="font-semibold text-slate-900 text-xs">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`font-semibold px-2.5 py-0.5 rounded text-xs ${p.current_stock <= (p.low_stock_limit || 5) ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                            {p.current_stock} {p.unit_type || 'units'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <input 
                                            type="number" 
                                            placeholder="Qty"
                                            className={`w-20 px-2.5 py-1 border rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 ${isSelected ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-50'}`}
                                            value={restockData[p.id]?.quantity || ''}
                                            onChange={e => handleRestockChange(p.id, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-5 py-3">
                                        <select 
                                            className={`w-36 px-2.5 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 ${isSelected ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-50'}`}
                                            value={restockData[p.id]?.supplier_id || ''}
                                            onChange={e => handleRestockChange(p.id, 'supplier_id', e.target.value)}
                                        >
                                            <option value="">{globalSupplier ? 'Global Supplier' : 'Select Supplier'}</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <input 
                                            type="date" 
                                            className={`w-32 px-2.5 py-1 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 ${isSelected ? 'border-blue-400 bg-white' : 'border-slate-200 bg-slate-50'}`}
                                            value={restockData[p.id]?.expiry_date || p.expiry_date || ''}
                                            onChange={e => handleRestockChange(p.id, 'expiry_date', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
