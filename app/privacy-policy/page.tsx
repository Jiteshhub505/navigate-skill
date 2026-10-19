import React from 'react';

export default function PrivacyPolicy() {
    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Data Collection</h2>
                        <p>Navigate Skills collects essential information required to deliver our services, including names, email addresses, phone numbers, and technical data such as IP addresses and device identifiers.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Payment Processing</h2>
                        <p>We do not store complete credit card numbers or sensitive financial data on our servers. All transactions are securely processed through regulated third-party payment gateways. By making a purchase, you agree to the processing of your data by these financial partners.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Compliance and Dispute Resolution</h2>
                        <p>Navigate Skills prioritizes the security and legality of our platform. We will disclose your personal information, communication logs, and technical identifiers to third parties without prior notice under the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>To comply with a legal obligation, police mandate, or government portal inquiry.</li>
                            <li>To defend against fraudulent chargebacks, cyber complaints, or payment disputes.</li>
                            <li>To protect the personal safety of our instructors, users, or the public.</li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Jurisdiction</h2>
                        <p>This Privacy Policy and all operations of Navigate Skills are governed by the laws of India. Any legal disputes, claims, or proceedings arising from the use of our website or services shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}