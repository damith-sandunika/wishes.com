import React from 'react';
import { Globe, Share2 } from 'lucide-react';

export default function SocialLinksTab({ settings, handleChange }) {
    const inp = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-xs font-medium';

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                <Share2 size={18} className="text-blue-600" />
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Official Social Media Profiles</h3>
                    <p className="text-[11px] text-slate-500">Connected to your storefront footer and contact channels</p>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Facebook Page URL</label>
                <input 
                    placeholder="https://facebook.com/wishes.official" 
                    value={settings.social_facebook || ''} 
                    onChange={e => handleChange('social_facebook', e.target.value)} 
                    className={inp} 
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Instagram Profile URL</label>
                <input 
                    placeholder="https://instagram.com/wishes_lk" 
                    value={settings.social_instagram || ''} 
                    onChange={e => handleChange('social_instagram', e.target.value)} 
                    className={inp} 
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">TikTok Channel URL</label>
                <input 
                    placeholder="https://tiktok.com/@wishes.gifts" 
                    value={settings.social_tiktok || ''} 
                    onChange={e => handleChange('social_tiktok', e.target.value)} 
                    className={inp} 
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">YouTube Channel URL</label>
                <input 
                    placeholder="https://youtube.com/@wishes_celebrations" 
                    value={settings.social_youtube || ''} 
                    onChange={e => handleChange('social_youtube', e.target.value)} 
                    className={inp} 
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Official WhatsApp Support Number</label>
                <input 
                    placeholder="+94 77 123 4567" 
                    value={settings.social_whatsapp || ''} 
                    onChange={e => handleChange('social_whatsapp', e.target.value)} 
                    className={inp} 
                />
            </div>
        </div>
    );
}
