import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

export default function SalesReportTab({ sales }) {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" /> Monthly Revenue Performance
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Filtered: Current Year</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Month</th>
                                <th className="px-4 py-3">Completed Orders</th>
                                <th className="px-4 py-3 text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                            {sales?.monthly?.length > 0 ? (
                                sales.monthly.map(m => (
                                    <tr key={m.month} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-bold text-slate-800">{MONTHS[m.month - 1] || `Month ${m.month}`}</td>
                                        <td className="px-4 py-3 text-slate-600">{m.total_orders} orders</td>
                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                            Rs. {Number(m.revenue).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-8 text-center text-slate-400">
                                        No finalized sales recorded for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
