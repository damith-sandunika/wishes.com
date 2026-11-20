import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        shop_name: 'Wishes.com',
        shop_phone: '+94 71 808 0582',
        shop_email: 'support@wishes.com',
        shop_address: 'Colombo, Sri Lanka',
        delivery_charge: '350',
        free_delivery_above: '5000',
        bank_account_number: 'Bank: Commercial Bank\nBranch: Colombo\nAcc Name: Wishes.com Pvt Ltd\nAcc No: 800123456789'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/public/settings')
            .then(res => {
                if (res.data && Object.keys(res.data).length > 0) {
                    setSettings(prev => ({...prev, ...res.data}));
                }
            })
            .catch(err => console.error('Error fetching settings:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
