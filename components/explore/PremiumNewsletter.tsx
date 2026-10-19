"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function PremiumNewsletter() {
    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#A020F0]/10 to-[#D946EF]/10 rounded-full blur-[200px]" />
                <div className="hidden sm:block absolute top-20 right-20 w-[300px] h-[300px] bg-[#FF4FD8]/10 rounded-full blur-[100px]" />
                <div className="hidden sm:block absolute bottom-20 left-20 w-[250px] h-[250px] bg-[#A020F0]/10 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Floating Glass Container */}
                    <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-white/50">
                        {/* Floating Shapes */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-[#A020F0]/20 to-[#D946EF]/20 rounded-2xl blur-xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-[#D946EF]/20 to-[#FF4FD8]/20 rounded-2xl blur-xl" />

                        <div className="relative text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#A020F0]/10 to-[#D946EF]/10 border border-[#A020F0]/20 mb-6">
                                <Sparkles className="w-4 h-4 text-[#A020F0]" />
                                <span className="text-sm font-semibold text-[#A020F0]">Newsletter</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
                                Stay Updated
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Get the latest course updates, tips, and exclusive offers delivered to your inbox.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <div className="relative flex-1">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 focus:border-[#A020F0] outline-none text-gray-900 placeholder-gray-400 transition-colors"
                                    />
                                </div>
                                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#A020F0] to-[#D946EF] text-white font-semibold hover:shadow-2xl hover:shadow-[#A020F0]/30 transition-all duration-300 hover:-translate-y-1">
                                    Subscribe
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mt-4">
                                Join 10,000+ learners. No spam, unsubscribe anytime.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
