import React from 'react';

export default function RefundPolicy() {
    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8">Refund and Cancellation Policy</h1>
                <div className="prose prose-purple max-w-none text-gray-700 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. No Refund Policy</h2>
                        <p>Navigate Skills provides access to strictly live, interactive educational and fitness sessions. Because our class sizes are carefully managed and enrollment instantly reserves a limited seat that cannot be offered to another participant, all sales are final. We do not offer refunds, partial refunds, or credits under any circumstances once a transaction is successfully completed.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cancellations and Missed Sessions</h2>
                        <p>Users are solely responsible for reviewing the schedule, curriculum, and prerequisites prior to completing a purchase.</p>
                        <p>Enrollments cannot be cancelled, paused, or transferred to another batch or individual.</p>
                        <p>Navigate Skills does not provide compensatory classes, recordings, or refunds for any live sessions missed by the user.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Technical Limitations</h2>
                        <p>Navigate Skills is not responsible for a user's inability to access live sessions due to personal technical limitations, including but not limited to poor internet connectivity, hardware malfunctions, or software incompatibility. Such issues do not qualify for a refund.</p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Right of Refusal</h2>
                        <p>We reserve the right to terminate a user's access to our platform without a refund if the user violates our terms of conduct, disrupts live sessions, or engages in harassment.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}