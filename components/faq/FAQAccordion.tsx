"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        category: "General",
        questions: [
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
            }
        ]
    },
    {
        category: "Payments & Refunds",
        questions: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets. All transactions are secured with industry-standard encryption."
            },
            {
                q: "Can I get a refund if I'm not satisfied?",
                a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with your first few classes, you can request a full refund, no questions asked."
            },
            {
                q: "Do you offer installment plans?",
                a: "Yes, for our 6-month and 1-year comprehensive programs, we offer flexible EMI options."
            }
        ]
    },
    {
        category: "Technical",
        questions: [
            {
                q: "What equipment do I need?",
                a: "You just need a device with a stable internet connection. For dance and fitness classes, we recommend a laptop or tablet for better visibility, and enough space to move around."
            },
            {
                q: "Can I access the courses on mobile?",
                a: "Absolutely! Our platform is fully responsive and works seamlessly on smartphones and tablets."
            }
        ]
    }
];

export function FAQAccordion() {
    const [activeCategory, setActiveCategory] = useState("General");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <>
            {/* Category Tabs */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {faqs.map((cat) => (
                            <button
                                key={cat.category}
                                onClick={() => { setActiveCategory(cat.category); setOpenIndex(null); }}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeCategory === cat.category
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {cat.category}
                            </button>
                        ))}
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-3xl mx-auto space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {faqs.find(c => c.category === activeCategory)?.questions.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="mb-4 bg-white rounded-2xl border border-gray-200 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                            className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                            aria-expanded={openIndex === i}
                                        >
                                            <span className="font-bold text-lg text-gray-900">{faq.q}</span>
                                            <span className={`transform transition-transform duration-300 text-purple-600 ${openIndex === i ? "rotate-180" : ""}`}>
                                                ▼
                                            </span>
                                        </button>
                                        <AnimatePresence>
                                            {openIndex === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </>
    );
}
