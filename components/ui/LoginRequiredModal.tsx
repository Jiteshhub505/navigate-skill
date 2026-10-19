'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, LogIn, UserPlus, Lock, Sparkles, Shield, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LoginRequiredModalProps {
    isOpen: boolean
    onClose: () => void
    courseName: string
}

export default function LoginRequiredModal({ isOpen, onClose, courseName }: LoginRequiredModalProps) {
    const router = useRouter()

    const handleLogin = () => {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
    }

    const handleSignup = () => {
        router.push(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md"
                        >
                            <div className="relative bg-white border border-purple-100 rounded-3xl overflow-hidden shadow-2xl">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200 z-10 text-gray-500 hover:text-gray-800"
                                >
                                    <X size={18} />
                                </button>

                                <div className="relative p-6 sm:p-8">
                                    {/* Animated lock icon */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                        className="w-16 h-16 mx-auto mb-5 relative"
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                                            <Lock size={32} className="text-white" />
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <h2 className="text-2xl font-black text-center text-gray-900 mb-2 tracking-tight">
                                        Unlock Course Enrollment
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-600 text-center text-sm mb-6">
                                        Sign in or create an account to enroll in <span className="text-purple-700 font-bold">{courseName}</span>.
                                    </p>

                                    {/* Benefits */}
                                    <div className="space-y-2.5 mb-6">
                                        {[
                                            { icon: Shield, text: '100% Secure payment processing' },
                                            { icon: CheckCircle, text: 'Instant access & batch scheduling' },
                                            { icon: Sparkles, text: 'Course completion certificate' },
                                        ].map((benefit, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-700 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100"
                                            >
                                                <benefit.icon size={16} className="text-purple-600 flex-shrink-0" />
                                                <span>{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="space-y-3">
                                        {/* Login button */}
                                        <button
                                            onClick={handleLogin}
                                            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <LogIn size={18} />
                                            Sign In to Continue
                                        </button>

                                        {/* Signup button */}
                                        <button
                                            onClick={handleSignup}
                                            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            <UserPlus size={18} />
                                            Create New Account
                                        </button>
                                    </div>

                                    {/* Footer text */}
                                    <p className="text-[11px] text-gray-500 text-center mt-5">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
