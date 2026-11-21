import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordView({ onBackToLogin }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter Code & New Password
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); setMsg('');
        try {
            const res = await axios.post('/api/auth/forgot-password', { email });
            setStep(2);
            setMsg(res.data.message || 'Verification code sent to your email.');
            if (res.data.demo_code) setCode(res.data.demo_code);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); setMsg('');
        try {
            const res = await axios.post('/api/auth/reset-password', {
                email,
                code,
                password: newPassword,
            });
            setMsg(res.data.message || 'Password reset successfully!');
            setTimeout(() => onBackToLogin(), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed.');
        } finally {
            setLoading(false);
        }
    };

    const inp = "w-full pl-9 pr-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#c8102e] focus:bg-white focus:outline-none transition";

    return (
        <div className="space-y-4">
            <button 
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#c8102e] font-semibold transition"
            >
                <ArrowLeft size={14} /> Back to Sign In
            </button>

            <div className="text-center pb-2">
                <div className="w-12 h-12 bg-rose-50 text-[#c8102e] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <KeyRound size={22} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Reset Your Password</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    {step === 1 ? 'Enter your email to receive a recovery code.' : 'Enter the verification code and your new password.'}
                </p>
            </div>

            {msg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2"><CheckCircle2 size={14} /> {msg}</div>}
            {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>}

            {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className={inp} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-60">
                        {loading ? 'Sending Code...' : 'Send Verification Code'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">6-Digit Verification Code</label>
                        <div className="relative">
                            <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required value={code} onChange={e => setCode(e.target.value)} placeholder="123456" className={inp} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="password" minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" className={inp} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#c8102e] hover:bg-[#b91c1c] text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-60">
                        {loading ? 'Updating Password...' : 'Reset & Save Password'}
                    </button>
                </form>
            )}
        </div>
    );
}
