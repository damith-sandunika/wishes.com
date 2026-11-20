import React from 'react';

export default function WhatsAppSettingsTab({ settings, handleChange, waStatus, waQr }) {
    const WAMessageBox = ({ label, settingKey, tags, placeholder }) => (
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-normal text-emerald-900">{label}</label>
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.384 0 12.03c0 2.128.553 4.195 1.604 6.01L.226 23.367l5.474-1.436c1.745.96 3.714 1.467 5.727 1.467 6.643 0 12.029-5.385 12.029-12.031C23.456 5.384 18.072 0 12.031 0zm.002 21.464c-1.802 0-3.568-.485-5.116-1.403l-.367-.217-3.805.998.983-3.712-.238-.378a9.928 9.928 0 01-1.52-5.32c0-5.502 4.478-9.98 9.98-9.98s9.98 4.478 9.98 9.98-4.477 9.98-9.98 9.98zm5.48-7.464c-.3-.15-1.776-.877-2.052-.978-.276-.1-.477-.15-.678.15-.2.3-.778.977-.954 1.177-.176.2-.352.226-.653.076-.301-.15-1.267-.467-2.414-1.492-.892-.797-1.496-1.782-1.672-2.083-.176-.302-.019-.465.132-.615.136-.136.301-.352.452-.527.151-.176.201-.301.301-.502.101-.201.05-.377-.025-.527-.075-.15-.678-1.631-.929-2.233-.245-.588-.495-.508-.678-.518-.176-.008-.377-.01-.578-.01-.2 0-.527.076-.803.377-.276.301-1.055 1.03-1.055 2.511 0 1.481 1.079 2.913 1.23 3.113.151.201 2.122 3.238 5.139 4.538.718.31 1.278.495 1.716.634.721.23 1.378.197 1.895.12.576-.086 1.776-.727 2.027-1.431.251-.703.251-1.306.176-1.431-.076-.126-.276-.201-.578-.352z"/></svg>
                </div>
            </div>
            <textarea 
                rows={5} 
                value={settings[settingKey] || ''} 
                onChange={e => handleChange(settingKey, e.target.value)} 
                placeholder={placeholder}
                className="w-full bg-white px-4 py-3 rounded-xl border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none flex-1 shadow-sm leading-relaxed" 
            />
            {tags && <p className="text-[10px] text-emerald-700/70 mt-2">{tags}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-800">WhatsApp Gateway Connection</h3>
                    <p className="text-xs text-gray-500 mt-1">Status: <span className={`font-bold ${waStatus === 'CONNECTED' ? 'text-emerald-600' : 'text-amber-600'}`}>{waStatus}</span></p>
                </div>
                {waQr && waStatus !== 'CONNECTED' && (
                    <div className="p-2 bg-gray-50 border rounded-xl">
                        <img src={waQr} alt="WhatsApp QR" className="w-28 h-28" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WAMessageBox 
                    label="Order Placed Template" 
                    settingKey="wa_order_template" 
                    tags="Tags: {{customer_name}}, {{invoice}}, {{total}}, {{address}}, {{tracking}}" 
                    placeholder="Hi {{customer_name}}! Thank you for ordering from Wishes.com..." 
                />
                <WAMessageBox 
                    label="Order Confirmed Template" 
                    settingKey="wa_confirm_template" 
                    tags="Tags: {{customer_name}}, {{invoice}}" 
                    placeholder="Hi {{customer_name}}! Your gift order has been confirmed..." 
                />
                <WAMessageBox 
                    label="Out for Delivery Template" 
                    settingKey="wa_delivery_template" 
                    tags="Tags: {{customer_name}}, {{invoice}}" 
                    placeholder="Hi {{customer_name}}! Your gift is out for delivery! 🚚" 
                />
                <WAMessageBox 
                    label="Delivered & Completed Template" 
                    settingKey="wa_completed_template" 
                    tags="Tags: {{customer_name}}, {{invoice}}" 
                    placeholder="Hi {{customer_name}}! Your gift has been delivered successfully! 🎉" 
                />
            </div>
        </div>
    );
}
