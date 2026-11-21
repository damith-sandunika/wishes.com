import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, User, LogOut } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import AccountAuthForm from '../components/account/AccountAuthForm';
import AccountOrdersTab from '../components/account/AccountOrdersTab';
import AccountProfileTab from '../components/account/AccountProfileTab';

export default function Account() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activePortalTab, setActivePortalTab] = useState('orders');
    const [activeTab, setActiveTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('user');
            if (saved) {
                setUser(JSON.parse(saved));
                fetchOrders();
            }
        } catch {}
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get('/api/user/orders', { headers });
            const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.data) ? res.data.data : []);
            setOrders(list);
        } catch {
            setOrders([]);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/login', { email: loginEmail, password: loginPassword });
            const u = res.data.user;
            localStorage.setItem('user', JSON.stringify(u));
            if (res.data.token) localStorage.setItem('auth_token', res.data.token);
            setUser(u);
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/register', { name: regName, email: regEmail, password: regPassword });
            const u = res.data.user;
            localStorage.setItem('user', JSON.stringify(u));
            if (res.data.token) localStorage.setItem('auth_token', res.data.token);
            setUser(u);
            fetchOrders();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (data) => {
        const u = data.user;
        localStorage.setItem('user', JSON.stringify(u));
        if (data.token) localStorage.setItem('auth_token', data.token);
        setUser(u);
        fetchOrders();
    };

    const handleLogout = async () => {
        try { await axios.post('/api/logout'); } catch {}
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        setUser(null); setOrders([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <PageHero
                title="Customer Account"
                subtitle="Manage your profile, tracked deliveries, and recipient order history."
                badge="Member Portal"
                breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'My Account' }]}
            />
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {user ? (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-rose-50 text-[#c8102e] rounded-full flex items-center justify-center font-bold text-xl">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-xs text-gray-500">{user.email} {user.phone ? `• ${user.phone}` : ''}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#c8102e] border border-gray-200 px-4 py-2 rounded-xl transition">
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>

                        <div className="flex gap-2 border-b border-gray-200 pb-1">
                            <button
                                onClick={() => setActivePortalTab('orders')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                                    activePortalTab === 'orders' 
                                    ? 'bg-[#c8102e] text-white shadow-xs' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Package size={14} /> My Orders ({orders.length})
                            </button>
                            <button
                                onClick={() => setActivePortalTab('profile')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
                                    activePortalTab === 'profile' 
                                    ? 'bg-[#c8102e] text-white shadow-xs' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <User size={14} /> Profile & Security
                            </button>
                        </div>

                        {activePortalTab === 'orders' ? (
                            <AccountOrdersTab orders={orders} />
                        ) : (
                            <AccountProfileTab user={user} setUser={setUser} onLogout={handleLogout} />
                        )}
                    </div>
                ) : (
                    <AccountAuthForm
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        loginEmail={loginEmail}
                        setLoginEmail={setLoginEmail}
                        loginPassword={loginPassword}
                        setLoginPassword={setLoginPassword}
                        regName={regName}
                        setRegName={setRegName}
                        regEmail={regEmail}
                        setRegEmail={setRegEmail}
                        regPassword={regPassword}
                        setRegPassword={setRegPassword}
                        error={error}
                        setError={setError}
                        loading={loading}
                        handleLogin={handleLogin}
                        handleRegister={handleRegister}
                        onGoogleSuccess={handleGoogleSuccess}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
