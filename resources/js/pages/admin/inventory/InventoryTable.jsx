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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 cursor-pointer" onClick={handleCheckAll}>
                                {selectedIds.length > 0 && selectedIds.length === products.length ? <CheckSquare size={18} className="text-[#1933C6]"/> : <Square size={18} />}
                            </th>
                            <th className="px-6 py-4">Product Details</th>
                            <th className="px-6 py-4">Current Stock</th>
                            <th className="px-6 py-4">Restock Qty</th>
                            <th className="px-6 py-4">Supplier (Override)</th>
                            <th className="px-6 py-4 text-right">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? <tr><td colSpan="6" className="text-center p-8 text-gray-400">Loading...</td></tr> : 
                        products.map(p => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => handleCheck(p.id)}>
                                        {isSelected ? <CheckSquare size={18} className="text-[#1933C6]"/> : <Square size={18} className="text-gray-300"/>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-normal text-slate-900">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-normal px-2.5 py-1 rounded-md text-xs ${p.current_stock <= 5 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                            {p.current_stock} {p.unit_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="number" 
                                            placeholder="Qty"
                                            className={`w-20 px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSelected ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={restockData[p.id]?.quantity || ''}
                                            onChange={e => handleRestockChange(p.id, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            className={`w-40 px-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSelected ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={restockData[p.id]?.supplier_id || ''}
                                            onChange={e => handleRestockChange(p.id, 'supplier_id', e.target.value)}
                                        >
                                            <option value="">{globalSupplier ? 'Use Global Supplier' : 'Select Supplier'}</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <input 
                                            type="date" 
                                            className={`w-36 px-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${isSelected ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
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
