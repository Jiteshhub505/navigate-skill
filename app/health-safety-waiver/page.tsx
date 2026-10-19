import React from 'react';

export default function HealthSafetyWaiver() {
    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Health, Safety, and Consent Waiver</h1>
                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Assumption of Risk</h2>
                        <p>By enrolling in any physical, fitness, or yoga courses provided by Navigate Skills, the user acknowledges that physical exercise carries an inherent risk of injury. The user assumes all physical risks associated with participation and agrees that Navigate Skills, its owners, and its instructors are completely exempt from liability for any injuries, accidents, or health complications that occur during or after a live session.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Not Medical or Psychological Advice</h2>
                        <p>Navigate Skills provides educational instruction and coaching only.</p>
                        <p>Our services, instructors, and communications do not constitute medical, psychological, psychiatric, or therapeutic advice.</p>
                        <p>We do not diagnose, treat, or manage physical or mental health conditions.</p>
                        <p>Users experiencing physical distress, mental health crises, or suicidal ideation must immediately seek help from qualified healthcare professionals or national emergency helplines.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibility</h2>
                        <p>It is the sole responsibility of the user to consult with a physician prior to commencing any physical training program. The user affirms they are in good physical condition and do not suffer from any known disability or condition that would prevent or limit their participation.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}