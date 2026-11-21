import React from 'react';
import PolicyEditorLayout from './PolicyEditorLayout';

const DEFAULT_PRIVACY = [
    {
        title: '1. Information We Collect',
        content: 'We collect your contact details (name, email, phone number) and recipient details (name, address, delivery instructions) solely for executing the order delivery and communication.'
    },
    {
        title: '2. Payment Security',
        content: 'We do not store credit or debit card numbers on our servers. All online transactions are processed through bank-grade encrypted payment gateways with 3D Secure verification.'
    },
    {
        title: '3. Confidentiality of Gift Messages',
        content: 'Personal greeting card messages and custom photos shared for customization are strictly confidential and deleted after order completion.'
    }
];

export default function PrivacyPolicySettings() {
    return (
        <PolicyEditorLayout
            pageTitle="Privacy &amp; Data Security Policy"
            pageSubtitle="Configure clauses, data protection principles, and customer confidentiality guidelines shown on wishes.com/privacy-policy."
            settingKey="policy_privacy"
            defaultSections={DEFAULT_PRIVACY}
        />
    );
}
