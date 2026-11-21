import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, AlertTriangle } from 'lucide-react';

export default function AccountProfileTab({ user, setUser, onLogout }) {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [deactivating, setDeactivating] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg(''); setErr('');
        try {
            const token = localStorage.getItem('auth_token');
            const res = await axios.put('/api/user/profile', 
                { name, email, phone, password: password || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setMsg('Profile details updated successfully!');
            setPassword('');
        } catch (error) {
            setErr(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async () => {
        setDeactivating(true);
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete('/api/user/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Your account has been deactivated. Historical order records are safely archived.');
            onLogout();
        } catch {
            alert('Failed to deactivate account. Please try again.');
        } finally {
            setDeactivating(false);
            setShowDeactivateModal(false);
        }
    };

    const inp = 'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#c8102e] bg-gray-50/50 focus:bg-white';

    return (
        <div className="space-y-6">
            <form onSubmit={handleUpdate} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Personal Information</h3>
                {msg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl font-medium">{msg}</div>}
                {err && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium">{err}</div>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                        <input required value={name} onChange={e => setName(e.target.value)} className={inp} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inp} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp / Phone Number</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className={inp} placeholder="+94 77 123 4567" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">New Password (Leave blank to keep)</label>
                        <input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} className={inp} placeholder="••••••••" />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={saving} className="bg-[#c8102e] hover:bg-[#b91c1c] text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition shadow-xs disabled:opacity-60">
                        {saving ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                        <AlertTriangle size={15} /> Deactivate Account
                    </h4>
                    <p className="text-[11px] text-rose-700/80 mt-1">
                        Softly disable your account. Your order history and past invoices remain securely stored.
                    </p>
                </div>
                <button 
                    type="button" 
                    onClick={() => setShowDeactivateModal(true)} 
                    className="border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-semibold px-4 py-2 rounded-xl transition self-start sm:self-auto"
                >
                    Deactivate Account
                </button>
            </div>

            {showDeactivateModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 text-sm mb-2">Confirm Account Deactivation</h4>
                        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                            Are you sure you want to deactivate your account? You will be signed out immediately. All past purchases and receipts will be safely archived without affecting business sales reports.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowDeactivateModal(false)} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
                                Cancel
                            </button>
                            <button onClick={handleDeactivate} disabled={deactivating} className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl disabled:opacity-60">
                                {deactivating ? 'Deactivating...' : 'Yes, Deactivate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
