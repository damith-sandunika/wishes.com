import React from 'react';
import PolicyEditorLayout from './PolicyEditorLayout';

const DEFAULT_RETURNS = [
    {
        title: '1. Freshness & Quality Guarantee',
        content: 'If any fresh flowers or perishable items arrive damaged or sub-standard, please notify us within 24 hours of delivery along with a photo. We will immediately dispatch a fresh replacement or issue a full refund with no hassle.'
    },
    {
        title: '2. Personalized Items',
        content: 'Custom-printed mugs, engraved acrylic frames, and personalized greeting cards cannot be returned unless there was an error in printing on our side, in which case we will reprint and deliver at zero additional cost.'
    },
    {
        title: '3. Refund Processing',
        content: 'Approved refunds are credited back to the original payment method (Credit/Debit Card or Bank Transfer) within 3-5 business days.'
    }
];

export default function ReturnsSettings() {
    return (
        <PolicyEditorLayout
            pageTitle="Returns &amp; Refunds Policy"
            pageSubtitle="Configure perishable guarantees, custom item reprint guidelines, and refund turnaround times on wishes.com/returns."
            settingKey="policy_returns"
            defaultSections={DEFAULT_RETURNS}
        />
    );
}
