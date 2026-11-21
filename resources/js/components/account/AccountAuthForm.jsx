import React from 'react';

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
}) {
    return (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-md">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'login' ? 'Sign In to Wishes.com' : 'Create an Account'}
                </h1>
                <p className="text-xs text-gray-500 mt-1">Manage your gift deliveries &amp; track orders easily.</p>
            </div>

            <div className="flex border-b border-gray-100 mb-6">
                <button 
                    onClick={() => { setActiveTab('login'); setError(''); }} 
                    className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${activeTab === 'login' ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500'}`}
                >
                    Sign In
                </button>
                <button 
                    onClick={() => { setActiveTab('register'); setError(''); }} 
                    className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${activeTab === 'register' ? 'border-[#c8102e] text-[#c8102e]' : 'border-transparent text-gray-500'}`}
                >
                    Register
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">{error}</div>}

            {activeTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={loginEmail} 
                            onChange={e => setLoginEmail(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" 
                            placeholder="you@email.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={loginPassword} 
                            onChange={e => setLoginPassword(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" 
                            placeholder="••••••••" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-3 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-sm rounded-xl transition shadow-sm"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            required 
                            value={regName} 
                            onChange={e => setRegName(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" 
                            placeholder="Your name" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={regEmail} 
                            onChange={e => setRegEmail(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" 
                            placeholder="you@email.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            minLength={6} 
                            value={regPassword} 
                            onChange={e => setRegPassword(e.target.value)} 
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]" 
                            placeholder="At least 6 characters" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full py-3 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-sm rounded-xl transition shadow-sm"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            )}
        </div>
    );
}
