"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const newErrors: { [key: string]: boolean } = {};
        if (!formData.firstName) newErrors.firstName = true;
        if (!formData.email) newErrors.email = true;
        if (!formData.message) newErrors.message = true;
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setStatus("submitting");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ firstName: "", lastName: "", email: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen  bg-white transition-colors duration-300">
            {/* 1. Hero Section */}
            <section className="relative py-20 bg-gray-50 text-gray-900 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-purple-200/30 rounded-full blur-[128px]" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Get in <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Touch</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Have questions about our courses? We're here to help you start your journey.
                    </p>
                </div>
            </section>

            {/* 2. Contact Cards & 3. Form Section */}
            <section className="py-16 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Contact Info */}
                            <div className="p-10 bg-gradient-to-br from-purple-500 to-indigo-500 text-white relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
                                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                                <p className="text-purple-100 mb-10 text-lg">
                                    Fill out the form and our team will get back to you within 24 hours.
                                </p>

                                <div className="space-y-10">
                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1 text-xl">Phone</h3>
                                            <p className="text-white text-lg">+91 92181 87041</p>
                                            <p className="text-purple-100 text-sm font-medium">Available 9:00 AM - 8:00 PM</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1 text-xl">Email</h3>
                                            <p className="text-white text-lg">hello@navigateskill.com</p>
                                            <p className="text-purple-100 text-sm font-medium">Online Support 24/7</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1 text-xl">Office</h3>
                                            <p className="text-white text-lg">C-9/15, 3rd Floor, Sector 7, Rohini, Delhi - 110085</p>
                                            <p className="text-purple-100 text-sm font-medium">Near Rohini East Metro Station, Opposite Metro Pillar No. 399</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="p-10 bg-gray-50">
                                {status === "success" ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="h-full flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                        <p className="text-gray-600">Thank you for reaching out. We'll get back to you shortly.</p>
                                        <button
                                            onClick={() => setStatus("idle")}
                                            className="text-purple-600 font-bold hover:underline pt-4"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-600 ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, firstName: e.target.value });
                                                        setErrors(prev => ({ ...prev, firstName: false }));
                                                    }}
                                                    className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 ${errors.firstName ? "border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                                        }`}
                                                    placeholder="John"
                                                />
                                                {errors.firstName && <p className="text-red-500 text-xs ml-1">First name is required</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-600 ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-600 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, email: e.target.value });
                                                    setErrors(prev => ({ ...prev, email: false }));
                                                }}
                                                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 ${errors.email ? "border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                                    }`}
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs ml-1">Email is required</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-600 ml-1">Message</label>
                                            <textarea
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, message: e.target.value });
                                                    setErrors(prev => ({ ...prev, message: false }));
                                                }}
                                                className={`w-full px-5 py-4 rounded-2xl border outline-none transition-all resize-none bg-white text-gray-900 placeholder:text-gray-400 ${errors.message ? "border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                                    }`}
                                                placeholder="How can we help you?"
                                            />
                                            {errors.message && <p className="text-red-500 text-xs ml-1">Message is required</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === "submitting"}
                                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {status === "submitting" ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </button>
                                        {status === "error" && (
                                            <p className="text-rose-500 text-sm font-medium text-center">Something went wrong. Please try again.</p>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Visit Our Campus</h2>
                        <p className="text-gray-600">Find us at our Delhi location</p>
                    </div>
                    <div className="w-full h-[500px] bg-white rounded-[2rem] overflow-hidden relative border border-gray-200 shadow-2xl">
                        <iframe
                            src="https://maps.google.com/maps?q=Rohini+East+Metro+Station,+Sector+7,+Rohini,+Delhi+110085&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* 5. Support Hours */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-gray-50 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-200 hover:border-purple-500/30 transition-all group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🕒</div>
                            <h3 className="font-bold text-gray-900 text-xl mb-2">Weekdays</h3>
                            <p className="text-gray-600">9:00 AM - 8:00 PM</p>
                        </div>
                        <div className="bg-gray-50 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-200 hover:border-purple-500/30 transition-all group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📅</div>
                            <h3 className="font-bold text-gray-900 text-xl mb-2">Weekends</h3>
                            <p className="text-gray-600">10:00 AM - 6:00 PM</p>
                        </div>
                        <div className="bg-gray-50 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-200 hover:border-purple-500/30 transition-all group">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📧</div>
                            <h3 className="font-bold text-gray-900 text-xl mb-2">Email Support</h3>
                            <p className="text-gray-600">24/7 Response Time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What is NavigateSkills Academy?", a: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions." },
                            { q: "How do I enroll in a course?", a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch." },
                            { q: "Are the classes live or pre-recorded?", a: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material." },
                            { q: "Can I get a refund after purchasing a course or service?", a: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-500/30 transition-all group">
                                <div className="flex justify-between items-center cursor-pointer">
                                    <h3 className="font-bold text-gray-900 text-lg">{faq.q}</h3>
                                    <span className="text-purple-600 text-2xl group-hover:rotate-90 transition-transform">+</span>
                                </div>
                                <p className="text-gray-600 mt-4 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Social Hub */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-purple-50 text-gray-900 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-10">Connect With Us</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Twitter", "Facebook", "Instagram", "LinkedIn", "YouTube"].map((social, i) => (
                            <a key={i} href="#" className="px-8 py-4 bg-white rounded-2xl hover:bg-purple-600 hover:text-white transition-all font-bold backdrop-blur-md border border-gray-200 text-gray-900">
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
