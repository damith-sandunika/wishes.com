import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminStatCard from '../../components/admin/AdminStatCard';
import axios from 'axios';
import { DollarSign, ShoppingCart, AlertTriangle, Clock, BarChart3, CreditCard, PackageCheck } from 'lucide-react';
import SalesReportTab from './reports/SalesReportTab';
import PaymentsReportTab from './reports/PaymentsReportTab';
import ProductsReportTab from './reports/ProductsReportTab';

export default function AdminReports() {
    const [sales, setSales] = useState(null);
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            axios.get('/api/reports/sales'),
            axios.get('/api/reports/stock')
        ]).then(([rSales, rStock]) => {
            setSales(rSales.data);
            setStock(rStock.data);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return <AdminLayout pageTitle="Reports"><div className="p-6 text-slate-500">Loading reports...</div></AdminLayout>;

    const TABS = [
        { id: 'sales', label: 'Sales Report', icon: BarChart3 },
        { id: 'products', label: 'Product Performance', icon: PackageCheck },
        { id: 'payments', label: 'Pending Payments', icon: CreditCard },
        { id: 'stock', label: 'Inventory & Alerts', icon: AlertTriangle },
    ];

    return (
        <AdminLayout
            pageTitle="Reports & Analytics"
            pageSubtitle="Financial sales breakdown, pending payments audit, and inventory performance"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <AdminStatCard 
                    label="Total Revenue" 
                    value={`Rs. ${Number(sales?.totalRevenue || 0).toLocaleString()}`} 
                    icon={DollarSign} 
                    color="emerald" 
                    subtext="All-time completed sales"
                />
                <AdminStatCard 
                    label="Total Orders" 
                    value={sales?.totalOrders || 0} 
                    icon={ShoppingCart} 
                    color="blue" 
                    subtext="Processed checkouts"
                />
                <AdminStatCard 
                    label="Low Stock Items" 
                    value={stock?.lowStock?.length || 0} 
                    icon={AlertTriangle} 
                    color="amber" 
                    subtext="Items below reorder limit"
                />
                <AdminStatCard 
                    label="Expiring Soon" 
                    value={stock?.expiring?.length || 0} 
                    icon={Clock} 
                    color="rose" 
                    subtext="Within 30 days"
                />
            </div>

            <div className="border-b border-slate-200 mb-6 flex overflow-x-auto gap-2">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition border-b-2 whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg' 
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Icon size={14} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === 'sales' && <SalesReportTab sales={sales} />}
            {activeTab === 'products' && <ProductsReportTab />}
            {activeTab === 'payments' && <PaymentsReportTab />}
            {activeTab === 'stock' && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 mb-4">Stock Restock Priority</h3>
                    <div className="space-y-3">
                        {stock?.lowStock?.length > 0 ? (
                            stock.lowStock.map(p => (
                                <div key={p.id} className="flex justify-between items-center text-xs p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg">
                                    <div>
                                        <span className="text-slate-900 font-bold block">{p.name}</span>
                                        <span className="text-slate-500 text-[11px]">{p.category?.name || 'Item'}</span>
                                    </div>
                                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-md">{p.current_stock} left in stock</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-500">All current inventory levels are healthy.</p>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
