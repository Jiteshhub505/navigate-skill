"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function WhatsAppWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const [message, setMessage] = useState("");

    const baseWhatsappLink = "https://wa.me/919218187041";
    const defaultText = "Hey, I want to know about your yoga classes";

    const handleSendMessage = () => {
        const text = message.trim() || defaultText;
        const url = `${baseWhatsappLink}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-[#25D366] p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-inner">
                                🧘
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">NavigateSkills</h3>
                                <p className="text-white/90 text-xs flex items-center gap-1 font-medium">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    Online • Expert Guidance
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="ml-auto text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 bg-[#f0ede6] relative max-h-[300px] overflow-y-auto">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

                            <div className="relative z-10 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] mb-4 border border-gray-100">
                                <p className="text-sm text-gray-800">
                                    Namaste! 🙏 Welcome to NavigateSkills Academy.
                                </p>
                            </div>

                            <div className="relative z-10 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] border border-gray-100">
                                <p className="text-sm text-gray-800">
                                    How can we help you with your Yoga journey today?
                                </p>
                                <span className="text-[10px] text-gray-400 block text-right mt-1">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>

                        {/* Footer / Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="relative flex mb-3">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#25D366] focus:border-[#25D366] outline-none resize-none h-20 text-gray-800 placeholder:text-gray-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-500/20"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Send Message
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative group">
                <AnimatePresence>
                    {showTooltip && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-xl border border-gray-100 whitespace-nowrap text-sm font-semibold"
                        >
                            Need help? Chat with us!
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-8 border-transparent border-l-white"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl relative z-20 group hover:shadow-green-500/40"
                    aria-label="Open WhatsApp Chat"
                >
                    <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                    <svg className="w-9 h-9 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );
}
