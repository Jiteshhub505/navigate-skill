const fs = require('fs');
const path = require('path');

const faqsStr = `const faqs = [
    {
        category: "General",
        questions: [
            {
                q: "What is NavigateSkills Academy?",
                a: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions."
            },
            {
                q: "How do I enroll in a course?",
                a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch."
            },
            {
                q: "Are the classes live or pre-recorded?",
                a: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material."
            }
        ]
    },
    {
        category: "Payments & Refunds",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets. All transactions are secured with industry-standard encryption through our payment gateway."
            },
            {
                q: "Can I get a refund after purchasing a course or service?",
                a: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances."
            },
            {
                q: "What if I miss a live class, make a mistake, or want to cancel my enrollment?",
                a: "We strongly advise reviewing the course curriculum, prerequisites, and schedule carefully before making a purchase. Once a transaction is completed successfully, cancellations or batch transfers are not permitted. If you miss a live session, refunds or compensatory makeup classes are not provided."
            },
            {
                q: "What happens if I face technical issues accessing the live class?",
                a: "If you experience technical difficulties, our dedicated support team will work with you to resolve them promptly. However, technical issues on the user's end (such as poor internet connectivity, software issues, or device incompatibility) do not qualify for a refund."
            }
        ]
    },
    {
        category: "Technical",
        questions: [
            {
                q: "What equipment do I need?",
                a: "You just need a device with a stable internet connection. To get the most out of the live interactive sessions, we highly recommend a laptop or desktop computer."
            },
            {
                q: "Can I join the live courses on mobile?",
                a: "Absolutely! Our platform and live session links are fully responsive and work seamlessly on smartphones and tablets, allowing you to join the classes from anywhere."
            }
        ]
    }
];`;

const flattenFaqs1 = `const faqs = [
  { q: "What is NavigateSkills Academy?", a: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions." },
  { q: "How do I enroll in a course?", a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch." },
  { q: "Are the classes live or pre-recorded?", a: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material." },
  { q: "Can I get a refund after purchasing a course or service?", a: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances." }
];`;

const flattenFaqs2 = `const faqs = [
        {
            question: "What is NavigateSkills Academy?",
            answer: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions."
        },
        {
            question: "How do I enroll in a course?",
            answer: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch."
        },
        {
            question: "Are the classes live or pre-recorded?",
            answer: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material."
        },
        {
            question: "Can I get a refund after purchasing a course or service?",
            answer: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances."
        }
    ];`;

function updateFile(file, regex, replacement) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log("Updated", file);
}

// 1. app/faq/page.tsx
const appFaqRegex = /const faqs = \[\s*\{\s*category: "General"[\s\S]*?\]\s*\};\s*\];/;
let appFaqContent = fs.readFileSync('app/faq/page.tsx', 'utf8');
let startFaq = appFaqContent.indexOf('const faqs = [');
let endFaq = appFaqContent.indexOf('export default function FAQPage()');
if (startFaq !== -1 && endFaq !== -1) {
    let newContent = appFaqContent.slice(0, startFaq) + faqsStr + '\n\n' + appFaqContent.slice(endFaq);
    fs.writeFileSync('app/faq/page.tsx', newContent);
    console.log("Updated app/faq/page.tsx");
}

// 2. components/site/FAQ.tsx
let siteFaqContent = fs.readFileSync('components/site/FAQ.tsx', 'utf8');
startFaq = siteFaqContent.indexOf('const faqs = [');
endFaq = siteFaqContent.indexOf('export function FAQ()');
if (startFaq !== -1 && endFaq !== -1) {
    let newContent = siteFaqContent.slice(0, startFaq) + flattenFaqs1 + '\n\n' + siteFaqContent.slice(endFaq);
    fs.writeFileSync('components/site/FAQ.tsx', newContent);
    console.log("Updated components/site/FAQ.tsx");
}

// 3. components/home/FAQ.tsx
let homeFaqContent = fs.readFileSync('components/home/FAQ.tsx', 'utf8');
startFaq = homeFaqContent.indexOf('const faqs = [');
endFaq = homeFaqContent.indexOf('return (');
if (startFaq !== -1 && endFaq !== -1) {
    let newContent = homeFaqContent.slice(0, startFaq) + flattenFaqs2 + '\n\n    ' + homeFaqContent.slice(endFaq);
    fs.writeFileSync('components/home/FAQ.tsx', newContent);
    console.log("Updated components/home/FAQ.tsx");
}

// Now the policies
const refundPolicy = `import React from 'react';

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
}`;

const healthWaiver = `import React from 'react';

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
}`;

const privacyPolicy = `import React from 'react';

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
}`;

fs.mkdirSync('app/refund-policy', { recursive: true });
fs.writeFileSync('app/refund-policy/page.tsx', refundPolicy);

fs.mkdirSync('app/health-safety-waiver', { recursive: true });
fs.writeFileSync('app/health-safety-waiver/page.tsx', healthWaiver);

fs.mkdirSync('app/privacy-policy', { recursive: true });
fs.writeFileSync('app/privacy-policy/page.tsx', privacyPolicy);
console.log("Created policy pages");

// Update Footers
// 1. components/layout/Footer.tsx
let layoutFooter = fs.readFileSync('components/layout/Footer.tsx', 'utf8');
layoutFooter = layoutFooter.replace(
    /<Link href="\/privacy" className="[^"]*">\s*Privacy Policy\s*<\/Link>/,
    '<Link href="/privacy-policy" className="transition-colors hover:text-purple-400 text-gray-400">Privacy Policy</Link>'
);
layoutFooter = layoutFooter.replace(
    /<Link href="\/terms" className="[^"]*">\s*Terms of Service\s*<\/Link>/,
    '<Link href="/refund-policy" className="transition-colors hover:text-purple-400 text-gray-400">Refund Policy</Link>\n                        <Link href="/health-safety-waiver" className="transition-colors hover:text-purple-400 text-gray-400">Health & Safety Waiver</Link>'
);
fs.writeFileSync('components/layout/Footer.tsx', layoutFooter);
console.log("Updated components/layout/Footer.tsx");

// 2. components/site/Footer.tsx
let siteFooter = fs.readFileSync('components/site/Footer.tsx', 'utf8');
siteFooter = siteFooter.replace(
    /<a href="#" className="hover:text-primary-glow">Privacy<\/a>\s*<a href="#" className="hover:text-primary-glow">Terms<\/a>\s*<a href="#" className="hover:text-primary-glow">Cookies<\/a>/,
    '<a href="/privacy-policy" className="hover:text-primary-glow">Privacy</a>\n              <a href="/refund-policy" className="hover:text-primary-glow">Refund Policy</a>\n              <a href="/health-safety-waiver" className="hover:text-primary-glow">Waiver</a>'
);
fs.writeFileSync('components/site/Footer.tsx', siteFooter);
console.log("Updated components/site/Footer.tsx");
