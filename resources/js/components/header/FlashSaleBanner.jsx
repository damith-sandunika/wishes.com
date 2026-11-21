import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FlashSaleBanner() {
    const [banner, setBanner] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        axios.get('/api/public/coupons/active-banner')
            .then(res => {
                if (res.data?.banner_text) setBanner(res.data);
            })
            .catch(() => {});
    }, []);

    if (!banner || dismissed) return null;

    return (
        <div className="bg-gradient-to-r from-[#990011] via-[#c8102e] to-[#990011] text-white py-1.5 px-4 text-xs font-medium text-center relative flex items-center justify-center gap-2 shadow-xs">
            <Zap size={13} className="text-amber-300 fill-amber-300 animate-pulse shrink-0" />
            <span>{banner.banner_text}</span>
            <Link to="/shop" className="underline font-bold text-amber-200 hover:text-white ml-1">
                Shop Now &rarr;
            </Link>
            <button 
                onClick={() => setDismissed(true)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-0.5"
                aria-label="Dismiss banner"
            >
                <X size={13} />
            </button>
        </div>
    );
}
