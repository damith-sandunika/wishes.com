import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Package, LogOut, CheckCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Account() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
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
            setOrders(res.data || []);
        } catch {}
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

    const handleLogout = async () => {
        try { await axios.post('/api/logout'); } catch {}
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        setUser(null); setOrders([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {user ? (
                    <div className="space-y-6">
                        {/* Profile Bar */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-rose-50 text-[#c8102e] rounded-full flex items-center justify-center font-bold text-xl">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#c8102e] border border-gray-200 px-4 py-2 rounded-xl transition">
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>

                        {/* Order History */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                                    <div className="w-8 h-0.5 bg-[#c8102e] mt-1 rounded-full" />
                                </div>
                                <Link to="/shop" className="text-xs text-[#c8102e] font-semibold hover:underline">
                                    Explore Gifts &rarr;
                                </Link>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-sm text-gray-500 mb-4">You have not placed any orders yet.</p>
                                    <Link to="/shop" className="inline-block bg-[#c8102e] text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-[#b91c1c] transition">
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-xs transition">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-50">
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-800">Order #{order.invoice_number || order.id}</span>
                                                    <span className="text-[11px] text-gray-400 ml-2">Tracking: {order.tracking_number}</span>
                                                </div>
                                                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${order.delivery_status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {order.delivery_status || 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-600">
                                                <span>Total: <strong className="text-gray-900">Rs. {Number(order.grand_total).toLocaleString()}</strong> ({order.items?.length || 1} items)</span>
                                                <Link to={`/track-order?tracking=${order.tracking_number}`} className="text-[#c8102e] font-medium hover:underline">
                                                    Track Delivery &rarr;
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Customer Login / Register Form */
                    <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-md">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{activeTab === 'login' ? 'Sign In to Wishes.com' : 'Create an Account'}</h1>
                            <p className="text-xs text-gray-500 mt-1">Manage your gift deliveries &amp; track orders easily.</p>
                        </div>

                        <div className="flex border-b border-gray-100 mb-6">
                            <button onClick={() => { setActiveTab('login'); setError(''); }} className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${activeTab === 'login' ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500'}`}>
                                Sign In
                            </button>
                            <button onClick={() => { setActiveTab('register'); setError(''); }} className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${activeTab === 'register' ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500'}`}>
                                Register
                            </button>
                        </div>

                        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

                        {activeTab === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="you@email.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="••••••••" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-3 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-sm rounded-xl transition shadow-sm">
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" required value={regName} onChange={e => setRegName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="you@email.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" required minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" placeholder="At least 6 characters" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-3 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-sm rounded-xl transition shadow-sm">
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
