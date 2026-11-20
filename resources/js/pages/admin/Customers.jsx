import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const tabs = ['All Customers', 'WhatsApp Verified', 'New'];

export default function AdminCustomers() {
    const [activeTab, setActiveTab] = useState('All Customers');

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="mb-4 sm:mb-6 bg-white rounded-md p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-60">
                    <div className="w-24 h-24 bg-blue-50 rotate-45 translate-x-12 rounded-lg"></div>
                    <div className="w-36 h-36 bg-blue-100 rotate-45 translate-x-6 -ml-8 rounded-xl"></div>
                    <div className="w-48 h-48 bg-blue-200 rotate-45 -ml-12 rounded-2xl"></div>
                    <div className="w-32 h-32 bg-blue-300 rotate-45 -ml-16 rounded-lg"></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-normal text-slate-800 tracking-tight">Customers</h2>
                    <p className="text-slate-400 text-[9px] sm:text-[11px] font-normal uppercase tracking-widest mt-1">View and manage customer accounts</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 flex overflow-x-auto custom-scrollbar">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-normal transition-colors border-b-2 whitespace-nowrap ${
                            activeTab === tab 
                            ? 'border-[#1933C6] text-[#1933C6]' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="text-left px-6 py-3">Customer</th>
                                <th className="text-left px-6 py-3">WhatsApp</th>
                                <th className="text-left px-6 py-3">Total Orders</th>
                                <th className="text-left px-6 py-3">Total Spent</th>
                                <th className="text-left px-6 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="5" className="text-center py-16 text-gray-400">No customers found</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
