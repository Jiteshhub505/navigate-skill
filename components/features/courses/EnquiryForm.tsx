"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CourseWithRelations } from "@/types";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { MessageCircle, Mail, Phone, User, Send, Clock, AlertCircle } from "lucide-react";

interface EnquiryFormProps {
    course: CourseWithRelations;
    fullWidth?: boolean;
}

export const EnquiryForm = ({ course, fullWidth = false }: EnquiryFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const [formStartFired, setFormStartFired] = useState(false);
    const [phoneEnteredFired, setPhoneEnteredFired] = useState(false);
    const [emailEnteredFired, setEmailEnteredFired] = useState(false);
    const isYoga = course.slug === 'yoga' || course.title.toLowerCase().includes('yoga');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate fields
        const newErrors: { [key: string]: boolean } = {};
        if (!formData.name) newErrors.name = true;
        if (!formData.email) newErrors.email = true;
        if (!formData.phone) newErrors.phone = true;
        if (!formData.message) newErrors.message = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setStatus("submitting");

        try {
            // Send to contact API
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.name.split(' ')[0],
                    lastName: formData.name.split(' ').slice(1).join(' '),
                    email: formData.email,
                    message: `[Course Enquiry - ${course.title}]\n\nPhone: ${formData.phone}\n\n${formData.message}`
                })
            });

            if (response.ok) {
                setStatus("success");
                // Fire Facebook Pixel Contact event
                if (isYoga) {
                    trackMetaEvent('Contact', {
                        content_name: 'Yoga Enquiry'
                    }, formData);
                }
                // Also redirect to WhatsApp
                redirectToWhatsApp();
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Enquiry form error:", error);
            setStatus("error");
        }
    };

    const redirectToWhatsApp = () => {
        let phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9218187041";
        phoneNumber = phoneNumber.replace(/[\s\-+]/g, '');
        if (phoneNumber.length === 10 || !phoneNumber.startsWith('91')) {
            phoneNumber = '91' + phoneNumber;
        }

        let message = `Hi, I'm interested in the "${course.title}" course (Currently Out of Stock).\n\n` +
            `My Details:\n` +
            `- Name: ${formData.name}\n` +
            `- Email: ${formData.email}\n` +
            `- Phone: ${formData.phone}\n\n` +
            `Query: ${formData.message}\n\n` +
            `Please notify me when this course becomes available.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        try {
            const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow) {
                window.location.href = whatsappUrl;
            }
        } catch (e) {
            window.location.href = whatsappUrl;
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
            >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Enquiry Submitted!</h3>
                <p className="text-neutral-400 mb-6">
                    Thank you for your interest in <span className="text-white font-semibold">{course.title}</span>. We'll notify you when it's available.
                </p>
                <button
                    onClick={redirectToWhatsApp}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                </button>
            </motion.div>
        );
    }

    return (
        <div className={`grid grid-cols-1 ${fullWidth ? 'lg:grid-cols-12' : ''} gap-12`}>
            <div className={fullWidth ? 'lg:col-span-7' : ''}>
                <div className="space-y-8">
                    {/* Out of Stock Notice (Mobile Only if fullWidth) */}
                    <div className={`bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden group ${fullWidth ? 'lg:hidden' : ''}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors" />
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-amber-400 font-black uppercase tracking-widest text-[10px] mb-1">Currently Unavailable</h4>
                                <p className="text-neutral-400 text-xs leading-relaxed font-medium">
                                    This course is not available for enrollment right now. Submit an enquiry and we'll notify you when it becomes available.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enquiry Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h4 className="text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Submit Your Enquiry
                        </h4>

                        <div className="space-y-4">
                            {/* Name */}
                            <div className="relative group">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        setErrors(prev => ({ ...prev, name: false }));
                                        if (!formStartFired && e.target.value.trim().length > 0) {
                                            setFormStartFired(true);
                                            if (isYoga) {
                                                trackMetaEvent('Form_Start', {}, formData, true);
                                            }
                                        }
                                    }}
                                    placeholder="Full Name"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm ${errors.name
                                        ? "border-red-500/50"
                                        : "border-white/10 focus:border-amber-500/50"
                                        }`}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setErrors(prev => ({ ...prev, email: false }));
                                    }}
                                    onBlur={() => {
                                        if (!emailEnteredFired && formData.email.trim().length > 0) {
                                            setEmailEnteredFired(true);
                                            if (isYoga) {
                                                trackMetaEvent('Email_Entered', {}, formData, true);
                                            }
                                        }
                                    }}
                                    placeholder="Email Address"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm ${errors.email
                                        ? "border-red-500/50"
                                        : "border-white/10 focus:border-amber-500/50"
                                        }`}
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative group">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        setFormData({ ...formData, phone: e.target.value });
                                        setErrors(prev => ({ ...prev, phone: false }));
                                    }}
                                    onBlur={() => {
                                        if (!phoneEnteredFired && formData.phone.trim().length > 0) {
                                            setPhoneEnteredFired(true);
                                            if (isYoga) {
                                                trackMetaEvent('Phone_Entered', {}, formData, true);
                                            }
                                        }
                                    }}
                                    placeholder="Phone Number"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none transition-all text-sm ${errors.phone
                                        ? "border-red-500/50"
                                        : "border-white/10 focus:border-amber-500/50"
                                        }`}
                                />
                            </div>

                            {/* Message */}
                            <div className="relative group">
                                <MessageCircle size={16} className="absolute left-4 top-4 text-neutral-500 group-focus-within:text-amber-400 transition-colors" />
                                <textarea
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => {
                                        setFormData({ ...formData, message: e.target.value });
                                        setErrors(prev => ({ ...prev, message: false }));
                                    }}
                                    placeholder="What would you like to know?"
                                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder:text-neutral-600 focus:outline-none transition-all resize-none text-sm ${errors.message
                                        ? "border-red-500/50"
                                        : "border-white/10 focus:border-amber-500/50"
                                        }`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-95"
                        >
                            {status === "submitting" ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </div>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Submit Enquiry
                                </>
                            )}
                        </button>

                        {status === "error" && (
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                                Something went wrong. Please try again.
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                <Clock size={12} className="text-amber-500" />
                                24h Response
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-800" />
                            <div className="flex items-center gap-1.5 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                <MessageCircle size={12} className="text-green-500" />
                                WhatsApp Support
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {fullWidth && (
                <div className="lg:col-span-5">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8 sticky top-24">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white">Course Update</h4>
                                <p className="text-sm text-neutral-500 font-medium">Currently out of stock</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-bold mb-1">Priority Notification</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Be the first to know when new batches are announced. Our early-bird list gets priority access.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                                    <MessageCircle size={16} />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-bold mb-1">Expert Consultation</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">Our counselors will help you find the perfect alternative course based on your goals.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Direct Assistance</p>
                            <div className="space-y-2">
                                <p className="text-sm text-neutral-300 font-medium">Call or WhatsApp us for immediate help:</p>
                                <p className="text-lg font-black text-white">+91 92181 87041</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
