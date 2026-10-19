"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";

interface AboutContentProps {
    teachers: any[]; // kept for backward compat — ignored if teachersSection provided
    teachersSection?: ReactNode;
}

export default function AboutContent({ teachers, teachersSection }: AboutContentProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 transition-colors duration-300 overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative py-12 lg:py-16 pb-8 lg:pb-10 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200/40 rounded-full blur-[128px]" />
                    <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-200/40 rounded-full blur-[128px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-4"
                    >
                        Empowering Your <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Journey</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        At NavigateSkills Academy, we believe in the transformative power of learning.
                        Whether you're mastering a dance form, building physical strength, or navigating the financial markets,
                        we are here to guide you every step of the way.
                    </motion.p>
                </div>
            </section>

            {/* 2. Mission Section */}
            <section className="py-8 lg:py-10 bg-white cv-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-purple-600 font-bold tracking-wider uppercase text-xs mb-2 block">Our Purpose</span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Democratizing Specialized Education</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Our mission is to bridge the gap between passion and expertise. We connect aspiring learners with industry-leading instructors through an accessible, interactive, and community-driven platform.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Expert-led live interactive classes",
                                    "Personalized feedback and guidance",
                                    "Community-driven learning environment",
                                    "Flexible schedules to fit your lifestyle"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center text-white shrink-0">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-medium text-base">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-[350px] bg-gradient-to-br from-purple-600 via-purple-700 to-fuchsia-600 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 flex items-center justify-center text-white"
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src="/assets/yoga-course2.webp"
                                    alt="Yoga course practice — Navigate Skill Academy"
                                    fill
                                    loading="lazy"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-display font-bold">Focus on Impact</h3>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. Our Story / Timeline */}
            <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-purple-50 cv-auto">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">Our Journey</h2>
                        <p className="text-lg text-gray-600">From a small studio to a global learning platform.</p>
                    </div>
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-purple-300 before:to-transparent">
                        {[
                            { year: "2020", title: "The Beginning", desc: "Started as a small online dance community during the lockdown." },
                            { year: "2021", title: "Expansion", desc: "Added Fitness and Finance verticals based on community demand." },
                            { year: "2022", title: "Platform Launch", desc: "Launched our dedicated learning platform with live class capabilities." },
                            { year: "2023", title: "Global Reach", desc: "Crossed 5,000 active students from over 10 countries." },
                        ].map((item, i) => (
                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-purple-200 bg-white group-[.is-active]:bg-gradient-to-r group-[.is-active]:from-purple-600 group-[.is-active]:to-fuchsia-600 text-gray-500 group-[.is-active]:text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                    <div className="text-xs font-bold">{item.year}</div>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-lg shadow-purple-900/5 border border-purple-100 hover:shadow-xl transition-shadow">
                                    <h3 className="font-display font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Stats Section */}
            <section className="py-12 lg:py-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white relative overflow-hidden cv-auto">
                <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                        {[
                            { label: "Active Students", value: "5,000+" },
                            { label: "Expert Instructors", value: "50+" },
                            { label: "Live Classes", value: "10,000+" },
                            { label: "Success Stories", value: "98%" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-purple-100 font-semibold text-sm uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Core Values */}
            <section className="py-12 lg:py-16 bg-white cv-auto">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">Our Core Values</h2>
                        <p className="text-lg text-gray-600">The principles that guide everything we do.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Excellence", desc: "We strive for the highest quality in our content and instruction.", icon: "⭐", color: "bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600" },
                            { title: "Community", desc: "We build supportive environments where learners help each other grow.", icon: "🤝", color: "bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600" },
                            { title: "Innovation", desc: "We constantly evolve our teaching methods and platform technology.", icon: "💡", color: "bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600" },
                        ].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-purple-50 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 ${val.color}`}>
                                    {val.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{val.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Instructors Section — streamed in via Suspense from the page */}
            {teachersSection ?? (
                // Fallback: render inline if teachers array is passed directly
                teachers.length > 0 && (
                    <section className="py-12 lg:py-16 bg-gradient-to-b from-purple-50 to-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 text-center mb-12">Meet Our Experts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {teachers.map((teacher, i) => (
                                    <div key={teacher.id} className="rounded-3xl bg-white border border-gray-100 p-6">
                                        {teacher.user?.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            )}

            {/* 7. Join Our Team */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-3xl p-8 lg:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-purple-500/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Join Our Team</h2>
                            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                                We are always looking for passionate instructors and team members.
                                If you love teaching and want to make an impact, we want to hear from you.
                            </p>
                            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-base hover:bg-purple-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                                View Open Positions
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
