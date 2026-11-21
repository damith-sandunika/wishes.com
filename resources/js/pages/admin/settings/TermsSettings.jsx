import React from 'react';
import PolicyEditorLayout from './PolicyEditorLayout';

const DEFAULT_TERMS = [
    {
        title: '1. Agreement to Terms',
        content: 'By accessing or purchasing from Wishes.com, you agree to be bound by these Terms and our Delivery & Refund Policies.'
    },
    {
        title: '2. Product Availability & Substitution',
        content: 'Due to seasonal flower blooms and artisan handcrafted items, minor variations in shade or basket styles may occur. We guarantee any substitution will always be of equal or greater value and beauty.'
    },
    {
        title: '3. Pricing & Currency',
        content: 'All prices listed on Wishes.com are in Sri Lankan Rupees (LKR) and include applicable packaging taxes.'
    }
];

export default function TermsSettings() {
    return (
        <PolicyEditorLayout
            pageTitle="Terms &amp; Conditions"
            pageSubtitle="Configure service guidelines, pricing conditions, and substitution agreements shown on wishes.com/terms."
            settingKey="policy_terms"
            defaultSections={DEFAULT_TERMS}
        />
    );
}
