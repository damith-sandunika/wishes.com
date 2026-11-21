import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import ForgotPasswordView from './ForgotPasswordView';

export default function AccountAuthForm({
    activeTab,
    setActiveTab,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    regName,
    setRegName,
    regEmail,
    setRegEmail,
    regPassword,
    setRegPassword,
    error,
    setError,
    loading,
    handleLogin,
    handleRegister,
    onGoogleSuccess,
}) {
    const [showForgot, setShowForgot] = useState(false);
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [showRegPass, setShowRegPass] = useState(false);

    const inp = "w-full pl-9 pr-10 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#c8102e] focus:bg-white focus:outline-none transition font-medium";

    if (showForgot) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <ForgotPasswordView onBackToLogin={() => setShowForgot(false)} />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100/60 p-2.5 mx-auto mb-3 shadow-2xs flex items-center justify-center">
                    <img src="/logo.png" alt="Wishes.com" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    {activeTab === 'login' ? 'Welcome Back!' : 'Join Wishes.com'}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    {activeTab === 'login' ? 'Sign in to track orders & manage recipients.' : 'Create an account to send gifts & track surprises.'}
                </p>
            </div>

            {/* Google 1-Click Sign In / Register */}
            <div className="mb-4">
                <GoogleAuthButton 
                    text={activeTab === 'login' ? 'Continue with Google' : 'Sign up with Google'} 
                    onSuccess={onGoogleSuccess} 
                    onError={setError} 
                />
            </div>

            <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">or continue with email</span>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100/80 p-1 rounded-xl mb-5">
                <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(''); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'login' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setError(''); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeTab === 'register' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    Create Account
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">{error}</div>}

            {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="name@example.com" className={inp} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-gray-700">Password</label>
                            <button type="button" onClick={() => setShowForgot(true)} className="text-[11px] font-bold text-[#c8102e] hover:underline">
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type={showLoginPass ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" className={inp} />
                            <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showLoginPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-xs rounded-xl transition shadow-xs active:scale-98 disabled:opacity-60">
                        {loading ? 'Signing In...' : 'Sign In to Account'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="e.g. Kasun Silva" className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="kasun@example.com" className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type={showRegPass ? 'text' : 'password'} minLength={6} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="At least 6 characters" className={inp} />
                            <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showRegPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-xs rounded-xl transition shadow-xs active:scale-98 disabled:opacity-60">
                        {loading ? 'Creating Account...' : 'Agree & Create Account'}
                    </button>
                </form>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>256-Bit SSL Encrypted &amp; Privacy Guaranteed</span>
            </div>
        </div>
    );
}
