import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: 'admin@wishes.com', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/login', form);
            if (res.data?.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Left Side - Wishes.com Branding */}
            <div className="hidden md:flex md:w-[45%] lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white" style={{ background: 'linear-gradient(135deg, #b91c1c, #dc2626)' }}>
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ mixBlendMode: 'overlay' }}>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-400 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-400 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <img src="/logo.png" alt="Wishes.com Logo" className="h-14 w-auto bg-white p-2 rounded-2xl shadow-xl ring-2 ring-white/20 object-contain" />
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight leading-none">Wishes.com</h1>
                        <p className="text-xs font-medium text-rose-200 uppercase tracking-widest mt-1">Admin Management Portal</p>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg mt-12">
                    <h2 className="text-4xl lg:text-5xl font-medium mb-6 leading-tight drop-shadow-sm">Celebrate Every Moment Seamlessly.</h2>
                    <p className="text-rose-100 text-lg leading-relaxed font-light">Monitor real-time gift orders, manage floral & hamper inventory, and process customer deliveries with ease.</p>
                </div>

                <div className="relative z-10 mt-12">
                    <p className="text-[10px] font-medium text-rose-200 uppercase tracking-widest">Enterprise Edition • <span className="text-white">Wishes.com</span></p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 relative bg-white overflow-hidden">
                <div className="md:hidden relative z-10 flex flex-col items-center mb-8 text-center">
                    <img src="/logo.png" alt="Wishes.com Logo" className="h-14 w-auto object-contain mb-3" />
                    <h2 className="text-2xl font-semibold text-slate-800 tracking-tight leading-tight">Wishes.com Admin</h2>
                    <p className="text-[11px] font-medium text-red-600 uppercase tracking-widest mt-1">Management Portal</p>
                </div>

                <div className="mx-auto w-full max-w-sm relative z-10">
                    <div className="hidden md:block mb-8">
                        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">Welcome Back</h2>
                        <p className="text-sm text-slate-500 mt-2 font-light">Sign in to manage your e-commerce gift store.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center shadow-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                className="appearance-none block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="admin@wishes.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={e => setForm({...form, password: e.target.value})}
                                className="appearance-none block w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all shadow-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">Default Credentials: <span className="font-mono text-slate-600 font-medium">admin@wishes.com / password</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
