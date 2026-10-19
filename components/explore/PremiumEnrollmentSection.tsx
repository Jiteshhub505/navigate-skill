"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Award, Users, Clock, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

const EnrollmentForm = dynamic(() =>
    import("@/components/features/courses/EnrollmentForm").then(mod => ({ default: mod.EnrollmentForm }))
);
const EnquiryForm = dynamic(() =>
    import("@/components/features/courses/EnquiryForm").then(mod => ({ default: mod.EnquiryForm }))
);

interface PremiumEnrollmentSectionProps {
    featuredCourse: any[];
}

export function PremiumEnrollmentSection({ featuredCourse }: PremiumEnrollmentSectionProps) {
    return (
        <section id="enroll" className="py-8 lg:py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-1">
                        {featuredCourse[0]?.deletedAt ? 'Join the Waitlist' : 'Start Your Wellness Journey'}
                    </h2>
                    <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                        {featuredCourse[0]?.deletedAt
                            ? 'This course is currently out of stock. Leave your details and we\'ll notify you when it\'s back.'
                            : 'Transform your mind and body with our expert-led live classes'
                        }
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {featuredCourse[0] ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                                {/* Offer Banner */}
                                {!featuredCourse[0].deletedAt && (
                                    <div className="bg-gradient-to-r from-[#A020F0] to-[#D946EF] px-4 py-2 flex items-center justify-center gap-2">
                                        <span className="text-sm">🎁</span>
                                        <span className="font-semibold text-sm text-white">Special Offer: ₹20 Trial Class Available!</span>
                                        <Link
                                            href="/courses/yoga#enroll"
                                            className="px-3 py-1 bg-white text-[#A020F0] rounded-full text-xs font-bold hover:bg-white/90 transition-colors"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Benefits */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                        {[
                                            { icon: ShieldCheck, text: 'Lifetime Access' },
                                            { icon: Award, text: 'Certificate' },
                                            { icon: Users, text: 'Community Support' },
                                            { icon: Clock, text: 'Mobile Learning' }
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                <benefit.icon className="w-5 h-5 text-[#D946EF]" />
                                                <span className="text-xs text-gray-600 font-medium">{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4">
                                        {featuredCourse[0].deletedAt ? (
                                            <EnquiryForm course={featuredCourse[0]} fullWidth />
                                        ) : (
                                            <EnrollmentForm course={featuredCourse[0]} fullWidth />
                                        )}
                                    </div>
                                </div>

                                {/* Social Proof */}
                                <div className="px-6 pb-4">
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-[#A020F0] to-[#D946EF] border-2 border-white" />
                                            ))}
                                        </div>
                                        <span>Joined by 10,000+ students</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center text-gray-500 py-8 bg-purple-50 rounded-2xl border border-purple-200 text-sm">
                            No featured course available at the moment.
                        </div>
                    )}

                    {/* Trust Row */}
                    {featuredCourse[0] && !featuredCourse[0].deletedAt && (
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                <span>100% Secure Payment</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-600" />
                                <span>Certificate Included</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>Lifetime Access</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
