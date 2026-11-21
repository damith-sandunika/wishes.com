import React, { useState } from 'react';
import axios from 'axios';

export default function GoogleAuthButton({ onSuccess, onError, text = 'Continue with Google' }) {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [googleEmail, setGoogleEmail] = useState('');
    const [googleName, setGoogleName] = useState('');

    const handleGoogleSubmit = async (e) => {
        e?.preventDefault();
        if (!googleEmail) return;
        setLoading(true);
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/auth/google', {
                email: googleEmail,
                name: googleName || googleEmail.split('@')[0],
            });
            setShowModal(false);
            onSuccess(res.data);
        } catch (err) {
            onError(err.response?.data?.message || 'Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200/90 shadow-2xs transition-all active:scale-98"
            >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{text}</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm">Sign in with Google</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Confirm your Google Account to sign in to Wishes.com instantly.</p>
                        <form onSubmit={handleGoogleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Name</label>
                                <input 
                                    required 
                                    value={googleName} 
                                    onChange={e => setGoogleName(e.target.value)} 
                                    placeholder="e.g. Kasun Silva" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Google Email Address</label>
                                <input 
                                    required 
                                    type="email" 
                                    value={googleEmail} 
                                    onChange={e => setGoogleEmail(e.target.value)} 
                                    placeholder="kasun@gmail.com" 
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-60">
                                    {loading ? 'Authenticating...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
