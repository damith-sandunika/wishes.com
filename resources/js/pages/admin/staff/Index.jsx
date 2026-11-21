import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../../layouts/AdminLayout';
import axios from 'axios';
import { UserCheck, Plus, Trash2, Edit2, Shield, User } from 'lucide-react';
import StaffModal from './StaffModal';

export default function StaffIndex() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'staff', password: '', is_active: true });

    const fetchStaff = useCallback(() => {
        setLoading(true);
        axios.get('/api/staff')
            .then(res => setStaffList(Array.isArray(res.data) ? res.data : []))
            .catch(() => setStaffList([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchStaff(); }, [fetchStaff]);

    const handleOpenCreate = () => {
        setEditingStaff(null);
        setForm({ name: '', email: '', phone: '', role: 'staff', password: '', is_active: true });
        setShowModal(true);
    };

    const handleOpenEdit = (member) => {
        setEditingStaff(member);
        setForm({ ...member, password: '', is_active: member.is_active ?? true });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingStaff) {
                await axios.put(`/api/staff/${editingStaff.id}`, form);
            } else {
                await axios.post('/api/staff', form);
            }
            setShowModal(false);
            fetchStaff();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving staff account');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this staff account?')) return;
        try {
            await axios.delete(`/api/staff/${id}`);
            fetchStaff();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove account.');
        }
    };

    return (
        <AdminLayout
            pageTitle="Staff Management"
            pageSubtitle="Manage employee access, order dispatchers and administrator credentials"
            headerActions={
                <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5">
                    <Plus size={16} /> Add Staff Account
                </button>
            }
        >
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3.5 font-semibold">User</th>
                                <th className="px-6 py-3.5 font-semibold">Phone</th>
                                <th className="px-6 py-3.5 font-semibold">Role</th>
                                <th className="px-6 py-3.5 font-semibold">Status</th>
                                <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Loading staff accounts...</td></tr>
                            ) : staffList.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">No staff members found.</td></tr>
                            ) : staffList.map(member => (
                                <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{member.name}</div>
                                        <div className="text-xs text-slate-400">{member.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{member.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${member.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {member.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                            {member.role === 'admin' ? 'Administrator' : 'Staff Member'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${member.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                            {member.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleOpenEdit(member)} className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition">
                                                <Edit2 size={15} />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <StaffModal 
                show={showModal} 
                onClose={() => setShowModal(false)} 
                onSave={handleSave} 
                form={form} 
                setForm={setForm} 
                isEditing={Boolean(editingStaff)} 
                saving={saving} 
            />
        </AdminLayout>
    );
}
