import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentsReportTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/reports/payments')
            .then(res => setData(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400 text-xs">Loading payment reports...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4">
                    <div className="text-xs font-bold text-amber-800">Total Pending Cash / Collections</div>
                    <div className="text-2xl font-black text-amber-950 mt-1">
                        Rs. {Number(data?.totalPendingAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-amber-700/80 mt-1">{data?.totalPendingCount || 0} orders waiting for payment</div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-700 mb-2">Pending Breakdown by Method</div>
                    <div className="space-y-1.5">
                        {data?.methodBreakdown?.map(m => (
                            <div key={m.payment_method} className="flex justify-between text-xs">
                                <span className="text-slate-600 font-medium">{m.payment_method || 'Unspecified'} ({m.count})</span>
                                <span className="font-bold text-slate-900">Rs. {Number(m.total).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">
                    Orders with Pending Payment
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Invoice</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Method</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data?.pendingOrders?.length > 0 ? (
                                data.pendingOrders.map(o => (
                                    <tr key={o.id} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 font-mono font-bold text-blue-600">#{o.invoice_number || o.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-800">{o.customer_name}</div>
                                            <div className="text-[11px] text-slate-400">{o.customer_phone}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{o.payment_method}</td>
                                        <td className="px-4 py-3 font-bold text-amber-700">Rs. {Number(o.grand_total).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link to={`/admin/orders/${o.id}`} className="text-blue-600 hover:underline font-semibold">
                                                Review Order &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-slate-400">No pending payments. All orders settled!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
