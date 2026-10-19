import { Metadata } from "next";
import { FAQAccordion } from "@/components/faq/FAQAccordion";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "FAQ | Frequently Asked Questions",
    description: "Find answers to common questions about Navigate Skill Academy's online yoga classes, fitness courses, payment options, refunds, and technical requirements.",
    alternates: {
        canonical: '/faq',
    },
    openGraph: {
        title: "FAQ — Navigate Skill Academy",
        description: "Find answers to common questions about our online yoga, fitness, dance and trading courses.",
        url: 'https://navigateskill.com/faq',
    }
};

// FAQ data — kept here in the server component for JSON-LD schema
const allFAQs = [
    {
        q: "What is NavigateSkills Academy?",
        a: "NavigateSkills Academy is a premier online learning platform offering specialized courses in Dance, Fitness, and Finance. We connect you with expert instructors for live interactive sessions and comprehensive recorded modules."
    },
    {
        q: "How do I enroll in a course?",
        a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process."
    },
    {
        q: "Are the classes live or pre-recorded?",
        a: "We offer a hybrid model. Most of our core curriculum is delivered through live interactive sessions to ensure real-time feedback. You also get access to high-quality recorded library for revision and practice."
    },
    {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets. All transactions are secured with industry-standard encryption."
    },
    {
        q: "Can I get a refund if I'm not satisfied?",
        a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with your first few classes, you can request a full refund, no questions asked."
    },
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
];

// FAQPage JSON-LD Schema — makes Google show rich FAQ snippets in search results
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQs.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": a
        }
    }))
};

// BreadcrumbList schema
const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://navigateskill.com" },
        { "@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://navigateskill.com/faq" }
    ]
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white transition-colors duration-300">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            {/* 1. Hero Section */}
            <section className="relative py-20 bg-gray-50 overflow-hidden border-b border-gray-200">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        How can we <span className="text-purple-600">help?</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our online yoga, fitness, dance, and trading courses.
                    </p>
                </div>
            </section>

            {/* 2. Search Section (Visual Placeholder) */}
            <section className="py-10 -mt-8 relative z-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white p-2 rounded-full shadow-lg border border-gray-200 flex items-center">
                        <div className="pl-6 text-slate-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                        />
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Interactive FAQ Accordion (Client Component) */}
            <FAQAccordion />

            {/* 4. Support Contact */}
            <section className="py-16 bg-gray-50 border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
                    <p className="text-gray-600 mb-8">
                        Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="/contact" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-all">
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>

            {/* 5. Quick Links */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Getting Started Guide", icon: "🚀", desc: "Everything you need to know to start learning." },
                            { title: "Billing & Subscriptions", icon: "💳", desc: "Manage your payments and plan details." },
                            { title: "Troubleshooting", icon: "🔧", desc: "Fix common technical issues quickly." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-500 transition-colors cursor-pointer group">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Community Section */}
            <section className="py-20 bg-purple-50 text-gray-900 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Join the Community Forum</h2>
                    <p className="text-purple-700 mb-8">
                        Connect with other learners, ask questions, and share your experiences in our moderated community forum.
                    </p>
                    <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition">
                        Visit Forum
                    </button>
                </div>
            </section>
        </div>
    );
}
