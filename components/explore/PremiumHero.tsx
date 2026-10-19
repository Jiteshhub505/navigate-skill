"use client";

import { motion } from "framer-motion";
import { Star, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface PremiumHeroProps {
    featuredCourse: any[];
}

export function PremiumHero({ featuredCourse }: PremiumHeroProps) {
    return (
        <section className="relative overflow-hidden py-20 lg:py-32">
            {/* Background Gradient Blobs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#A020F0]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#D946EF]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4FD8]/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A020F0]/10 border border-[#A020F0]/20 mb-8">
                            <Sparkles className="w-4 h-4 text-[#A020F0]" />
                            <span className="text-sm font-semibold text-[#A020F0]">Premium Learning Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 leading-tight mb-6">
                            Transform Your Future With{' '}
                            <span className="bg-gradient-to-r from-[#A020F0] via-[#D946EF] to-[#FF4FD8] bg-clip-text text-transparent">
                                Expert-Led Courses
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                            Master new skills with world-class instructors. From dance to finance, unlock your potential with courses designed for success.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link
                                href="#courses"
                                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#A020F0] to-[#D946EF] text-white font-semibold hover:shadow-2xl hover:shadow-[#A020F0]/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                Explore Courses
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#enroll"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 font-semibold hover:border-[#A020F0] hover:shadow-lg transition-all duration-300"
                            >
                                Start ₹20 Trial
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#A020F0]/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-[#A020F0]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">10,000+</div>
                                    <div className="text-sm text-gray-600">Students</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#D946EF]/10 flex items-center justify-center">
                                    <Star className="w-6 h-6 text-[#D946EF]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                                    <div className="text-sm text-gray-600">Rating</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-[#FF4FD8]/10 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-[#FF4FD8]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">50+</div>
                                    <div className="text-sm text-gray-600">Courses</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Floating Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Main Card */}
                        <div className="relative z-10 bg-white rounded-3xl p-6 shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#A020F0]/20 to-[#D946EF]/20 mb-4 overflow-hidden">
                                {featuredCourse.length > 0 && (
                                    <img
                                        src={featuredCourse[0].imageUrl}
                                        alt="Featured Course"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="px-3 py-1 rounded-full bg-[#A020F0]/10 text-[#A020F0] text-xs font-semibold">Featured</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-900">4.9</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {featuredCourse.length > 0 ? featuredCourse[0].title : 'Premium Course'}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {featuredCourse.length > 0 ? featuredCourse[0].description : 'Transform your skills with expert guidance'}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A020F0] to-[#D946EF]" />
                                    <span className="text-sm text-gray-600">Expert Instructor</span>
                                </div>
                                <span className="text-lg font-bold text-[#A020F0]">₹999</span>
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute -right-4 top-1/4 z-20 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/50 border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">98%</div>
                                    <div className="text-xs text-gray-600">Success Rate</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Learners Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="absolute -left-4 bottom-1/4 z-20 bg-white rounded-2xl p-4 shadow-xl shadow-gray-200/50 border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#A020F0]/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[#A020F0]" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">1,000+</div>
                                    <div className="text-xs text-gray-600">Active Learners</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
