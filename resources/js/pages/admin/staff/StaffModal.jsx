import React from 'react';

export default function StaffModal({ show, onClose, onSave, form, setForm, isEditing, saving }) {
    if (!show) return null;

    const inp = "w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-xs font-medium";

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-slate-200">
                <h3 className="font-bold text-base mb-4 text-slate-900 border-b border-slate-100 pb-3">
                    {isEditing ? 'Edit Staff Account' : 'Add New Staff Member'}
                </h3>
                <form onSubmit={onSave} className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                        <input 
                            required 
                            value={form.name} 
                            onChange={e => setForm({ ...form, name: e.target.value })} 
                            className={inp} 
                            placeholder="e.g. Kasun Perera" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                        <input 
                            required 
                            type="email" 
                            value={form.email} 
                            onChange={e => setForm({ ...form, email: e.target.value })} 
                            className={inp} 
                            placeholder="e.g. kasun@wishes.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp / Phone Number</label>
                        <input 
                            value={form.phone || ''} 
                            onChange={e => setForm({ ...form, phone: e.target.value })} 
                            className={inp} 
                            placeholder="+94 77 123 4567" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Account Role</label>
                            <select 
                                value={form.role} 
                                onChange={e => setForm({ ...form, role: e.target.value })} 
                                className={inp}
                            >
                                <option value="staff">Staff Member</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                {isEditing ? 'New Password (Optional)' : 'Password'}
                            </label>
                            <input 
                                required={!isEditing} 
                                type="password" 
                                minLength={6} 
                                value={form.password || ''} 
                                onChange={e => setForm({ ...form, password: e.target.value })} 
                                className={inp} 
                                placeholder={isEditing ? 'Leave blank to keep' : 'Min 6 characters'} 
                            />
                        </div>
                    </div>
                    {isEditing && (
                        <div className="flex items-center gap-2 pt-1">
                            <input 
                                type="checkbox" 
                                id="is_active" 
                                checked={form.is_active} 
                                onChange={e => setForm({ ...form, is_active: e.target.checked })} 
                                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
                            />
                            <label htmlFor="is_active" className="text-xs font-semibold text-slate-700">Account Active & Enabled</label>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm disabled:opacity-60">
                            {saving ? 'Saving...' : 'Save Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
