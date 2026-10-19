"use client";

import { motion } from "framer-motion";
import { Star, Users, Clock, BookOpen, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumFeaturedCourseProps {
    featuredCourse: any[];
}

export function PremiumFeaturedCourse({ featuredCourse }: PremiumFeaturedCourseProps) {
    return (
        <section className="py-4 lg:py-6 relative">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A020F0]/5 rounded-full blur-[200px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-1">Featured Course</h2>
                    <p className="text-sm text-gray-600">Handpicked by our experts to accelerate your learning journey</p>
                </div>

                {featuredCourse.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Animated Gradient Border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A020F0] via-[#D946EF] to-[#FF4FD8] rounded-[2rem] blur-sm opacity-75 animate-gradient" />
                        <div className="relative bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-gray-200/50">
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                {/* Left - Course Details */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#A020F0]/10 to-[#D946EF]/10 border border-[#A020F0]/20 text-[#A020F0] text-xs font-semibold">
                                            🔥 Trending Now
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-bold text-gray-900">4.9</span>
                                            <span className="text-gray-600 text-xs">(2,847 reviews)</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-3">
                                        {featuredCourse[0].title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                        {featuredCourse[0].description}
                                    </p>

                                    {/* Pricing Options */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                                            <div className="text-xs text-gray-600 mb-1">1 Month</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-gray-900">₹599</span>
                                                <span className="text-sm text-gray-400 line-through">₹999</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
                                            <div className="text-xs text-purple-700 mb-1 font-semibold">6 Months</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-purple-900">₹999</span>
                                                <span className="text-sm text-purple-400 line-through">₹1999</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/courses/yoga"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#A020F0] to-[#D946EF] text-white font-semibold hover:shadow-xl hover:shadow-[#A020F0]/30 transition-all duration-300 text-sm"
                                    >
                                        View Course Details
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Right - Large Image */}
                                <div className="relative">
                                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
                                        <img
                                            src="/assets/yogacard.webp"
                                            alt={featuredCourse[0].title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    {/* Floating Glow */}
                                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r from-[#A020F0]/30 to-[#D946EF]/30 rounded-full blur-2xl -z-10" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-12 text-gray-500">No featured course available.</div>
                )}
            </div>
        </section>
    );
}
