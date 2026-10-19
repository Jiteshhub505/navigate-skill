"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Script from "next/script";
import { CourseWithRelations } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useRazorpay } from "@/hooks/useRazorpay";
import { trackMetaEvent } from "@/lib/meta-pixel";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import { validateCouponAction } from "@/app/actions/coupons";
import { User, Mail, Phone, CreditCard, AlertTriangle, ChevronRight, Zap, ShieldCheck, Award, Users, Star, Tag, X } from "lucide-react";
import Link from "next/link";



interface EnrollmentFormProps {
    course: CourseWithRelations;
    onClose?: () => void;
    isModal?: boolean;
    fullWidth?: boolean;
    showOnlyActivePricing?: boolean; // New prop to control pricing display
    skipLoginRequired?: boolean; // New prop to skip login requirement
    theme?: 'dark' | 'light'; // New prop for theme
}

export const EnrollmentForm = ({ course, onClose, isModal = false, fullWidth = false, showOnlyActivePricing = false, skipLoginRequired = false, theme = 'light' }: EnrollmentFormProps) => {
    const pricingOptions = (course.coursePricings || [])
        .filter((p) => {
            // If showOnlyActivePricing=true (new page): show only isActive=true
            // If showOnlyActivePricing=false (old page): show only isActive=false
            return showOnlyActivePricing ? p.isActive === true : p.isActive === false;
        })
        .map((p) => ({
            id: p.id,
            durationId: p.durationId,
            label: p.duration?.name || "Plan",
            original: Number(p.originalPrice),
            discounted: Number(p.discountedPrice),
        }))
        .sort((a, b) => {
            const getPlanOrder = (label: string) => {
                const l = label.toLowerCase().trim();
                if (l.includes('trial') || l.includes('demo')) return 1;
                if (l.includes('1 month') || l.includes('1m') || l === 'monthly') return 2;
                if (l.includes('3 month') || l.includes('3m') || l.includes('quarterly')) return 3;
                if (l.includes('6 month') || l.includes('6m') || l.includes('half yearly') || l.includes('half-yearly')) return 4;
                if (l.includes('year') || l.includes('12 month')) return 5;
                return 99;
            };
            return getPlanOrder(a.label) - getPlanOrder(b.label);
        });

    // Check if pricing is available
    const hasPricing = pricingOptions.length > 0;

    const [selectedPricingId, setSelectedPricingId] = useState<string>(
        pricingOptions[0]?.id || ""
    );
    const [selectedTiming, setSelectedTiming] = useState<string>("");
    const [selectedBatchCategory, setSelectedBatchCategory] = useState<string>("");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: 'percentage' | 'fixed'; discountValue: number } | null>(null);
    const [couponError, setCouponError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [paymentDetails, setPaymentDetails] = useState<{
        paymentId?: string;
        orderId?: string;
        receipt?: string;
    } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const [formStartFired, setFormStartFired] = useState(false);
    const [phoneEnteredFired, setPhoneEnteredFired] = useState(false);
    const [emailEnteredFired, setEmailEnteredFired] = useState(false);
    const isYoga = course.slug === 'yoga' || course.title.toLowerCase().includes('yoga');

    // Clear coupon when duration changes
    useEffect(() => {
        setAppliedCoupon(null);
        setCouponError("");
    }, [selectedPricingId]);

    // Clear errors when all fields are filled
    useEffect(() => {
        const newErrors: { [key: string]: boolean } = {};
        if (!selectedPricingId && hasPricing) newErrors.plan = true;
        if (!selectedTiming) newErrors.timing = true;
        if (!formData.name) newErrors.name = true;
        if (!formData.phone) newErrors.phone = true;
        if (!formData.email) newErrors.email = true;

        // Only update errors if there are no errors (to clear the message)
        if (Object.keys(newErrors).length === 0) {
            setErrors({});
        }
    }, [selectedPricingId, selectedTiming, formData.name, formData.phone, formData.email, hasPricing]);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                // Try to get name from various sources
                let userName = user.user_metadata?.full_name
                    || user.user_metadata?.name
                    || user.user_metadata?.display_name
                    || '';

                // If no name in metadata, try fetching from database
                if (!userName && user.email) {
                    const { data: dbUser } = await supabase
                        .from('users')
                        .select('name')
                        .eq('email', user.email)
                        .single();

                    if (dbUser?.name) {
                        userName = dbUser.name;
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    name: userName,
                    email: user.email || "",
                }));
            }
            setIsUserLoading(false);
        };
        getUser();
    }, [supabase.auth]);

    const selectedPricing = pricingOptions.find((p) => p.id === selectedPricingId) || pricingOptions[0];


    const calculateFinalPrice = () => {
        if (!selectedPricing) return 0;
        let price = selectedPricing.discounted;
        if (appliedCoupon) {
            if (appliedCoupon.discountType === 'percentage') {
                price = price - (price * appliedCoupon.discountValue) / 100;
            } else {
                price = price - appliedCoupon.discountValue;
            }
        }
        return Math.max(0, Math.round(price));
    };

    const handleApplyCoupon = async () => {
        setCouponError("");
        if (!couponCode.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await validateCouponAction(
                couponCode,
                course.id,
                selectedPricing.discounted
            );

            if (result.error) {
                setCouponError(result.error);
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon({
                    code: result.code as string,
                    discountType: result.discountType as 'percentage' | 'fixed',
                    discountValue: result.discountValue as number
                });
                setCouponCode("");
            }
        } catch (err) {
            setCouponError("Failed to validate coupon");
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    const { processPayment, isProcessing: isRazorpayProcessing } = useRazorpay();

    const redirectToWhatsApp = (status: "success" | "cancelled", details?: { paymentId?: string; orderId?: string; receipt?: string }) => {
        console.log("=== WhatsApp Redirect Debug ===");
        console.log("Status:", status);
        console.log("Details:", details);
        console.log("Payment Details State:", paymentDetails);
        console.log("Form Data:", formData);
        console.log("Selected Timing:", selectedTiming);
        console.log("Selected Pricing:", selectedPricing);
        
        // Get phone number and ensure it has country code
        let phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9218187041";
        // Remove any spaces, dashes, or plus signs
        phoneNumber = phoneNumber.replace(/[\s\-+]/g, '');
        // Add country code if not present or if 10-digit number
        if (phoneNumber.length === 10 || !phoneNumber.startsWith('91')) {
            phoneNumber = '91' + phoneNumber;
        }
        
        const currentDetails = details || paymentDetails;

        // Build message with proper formatting
        let message = "";
        if (status === "success") {
            message = `Hi, I just enrolled in the ${course.title} course.\n\n`;
            message += `*Enrollment Details:*\n`;
            message += `• Name: ${formData.name}\n`;
            message += `• Email: ${formData.email}\n`;
            message += `• Phone: ${formData.phone}\n`;
            message += `• Plan: ${selectedPricing?.label || 'N/A'}\n`;
            message += `• Batch: ${selectedTiming || 'N/A'}\n`;
            message += `• Amount Paid: ₹${calculateFinalPrice()}\n\n`;
            message += `*Payment Status:* ✅ Successful`;
            if (currentDetails?.paymentId) message += `\n• Payment ID: ${currentDetails.paymentId}`;
            if (currentDetails?.orderId) message += `\n• Order ID: ${currentDetails.orderId}`;
            if (currentDetails?.receipt) message += `\n• Receipt: ${currentDetails.receipt}`;
            message += `\n\nLooking forward to starting the course!`;
        } else {
            message = `Hi, I was trying to enroll in the ${course.title} course, but my payment was ${status === "cancelled" ? "cancelled" : "unsuccessful"}.\n\n`;
            message += `*Enrollment Details:*\n`;
            message += `• Name: ${formData.name}\n`;
            message += `• Email: ${formData.email}\n`;
            message += `• Phone: ${formData.phone}\n`;
            message += `• Plan: ${selectedPricing?.label || 'N/A'}\n`;
            message += `• Batch: ${selectedTiming || 'N/A'}\n\n`;
            message += `*Payment Status:* ❌ ${status === "cancelled" ? "Cancelled" : "Failed"}\n\n`;
            message += `I need assistance with the enrollment process.`;
        }

        console.log("Message to send:", message);
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log("Final WhatsApp URL:", whatsappUrl);
        console.log("Phone Number:", phoneNumber);
        console.log("URL Length:", whatsappUrl.length);
        
        // Try multiple methods to open WhatsApp
        try {
            // Method 1: Try window.open with specific parameters
            const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            if (newWindow) {
                console.log("✅ WhatsApp opened successfully via window.open");
                newWindow.focus();
            } else {
                console.warn("⚠️ window.open returned null, trying fallback...");
                // Method 2: Direct navigation
                window.location.href = whatsappUrl;
            }
        } catch (error) {
            console.error("❌ Error opening WhatsApp:", error);
            // Method 3: Create and click a link
            const link = document.createElement('a');
            link.href = whatsappUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log("✅ WhatsApp opened via link click fallback");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate fields
        const newErrors: { [key: string]: boolean } = {};
        if (!selectedPricingId && hasPricing) newErrors.plan = true;
        if (!selectedTiming) newErrors.timing = true;
        if (!formData.name) newErrors.name = true;
        if (!formData.phone) newErrors.phone = true;
        if (!formData.email) newErrors.email = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Scroll to first error
            const firstErrorKey = Object.keys(newErrors)[0];
            const errorElement = document.getElementById(`error-${firstErrorKey}`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Check if user is logged in (unless skipLoginRequired is true)
        if (!skipLoginRequired) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setShowLoginModal(true);
                return;
            }
        }

        // Fire pixel tracking events
        if (isYoga) {
            trackMetaEvent('CompleteRegistration', {
                content_name: 'Yoga Course Registration'
            }, formData);
            trackMetaEvent('InitiateCheckout', {
                value: calculateFinalPrice(),
                currency: 'INR',
                content_name: 'Yoga Course'
            }, formData);
        }

        setIsSubmitting(true);

        try {
            await processPayment({
                amount: calculateFinalPrice(),
                courseId: course.id,
                durationId: selectedPricing.durationId,
                couponCode: appliedCoupon?.code,
                courseName: course.title,
                userName: formData.name,
                userEmail: formData.email,
                userPhone: formData.phone,
                timing: selectedTiming,
                skipAuthCheck: skipLoginRequired,
                onSuccess: (response) => {
                    console.log("✅ Payment successful - Full response:", response);
                    const details = {
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        receipt: response.receipt
                    };
                    console.log("Payment details:", details);
                    setPaymentDetails(details);
                    setIsSubmitted(true);

                    // Fire Facebook Pixel Purchase event
                    if (isYoga) {
                        const finalVal = calculateFinalPrice();
                        const planName = selectedPricing?.label || '1 Month';
                        if (planName === 'Trial') {
                            trackMetaEvent('Purchase', {
                                value: finalVal || 20,
                                currency: 'INR',
                                content_name: 'Yoga Trial',
                                plan: 'Trial'
                            }, formData);
                        } else if (planName === '6 Months') {
                            trackMetaEvent('Purchase', {
                                value: finalVal || 999,
                                currency: 'INR',
                                content_name: 'Yoga Course',
                                plan: '6 Months'
                            }, formData);
                        } else {
                            trackMetaEvent('Purchase', {
                                value: finalVal || 599,
                                currency: 'INR',
                                content_name: 'Yoga Course',
                                plan: '1 Month'
                            }, formData);
                        }
                    }
                    
                    // Wait a bit then try to open WhatsApp with success details
                    console.log("Attempting WhatsApp redirect in 1 second...");
                    setTimeout(() => {
                        console.log("Now redirecting to WhatsApp with success status");
                        redirectToWhatsApp("success", details);
                    }, 1000);
                },
                onError: (error) => {
                    console.error("Payment failed", error);
                    alert("Payment failed. Please try again.");
                    redirectToWhatsApp("cancelled");
                },
                onCancel: () => {
                    console.log("Payment cancelled");
                    redirectToWhatsApp("cancelled");
                }
            });
        } catch (error) {
            console.error("Error during enrollment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-gray-800 rounded-xl"
            >
                <div className="w-20 h-20 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Payment Successful! 🎉</h3>
                <p className="text-gray-400 mb-6">
                    Your enrollment in <span className="text-white font-semibold">{course.title}</span> is confirmed.
                </p>
                <div className="bg-gray-900 border border-white/5 rounded-xl p-4 text-left max-w-sm mx-auto shadow-sm mb-6">
                    <div className="text-sm text-gray-500 mb-2 font-medium">Payment Details</div>
                    {paymentDetails?.paymentId && (
                        <div className="flex justify-between text-gray-400 mb-1 text-xs">
                            <span>Payment ID</span>
                            <span className="font-mono">{paymentDetails.paymentId}</span>
                        </div>
                    )}
                    {paymentDetails?.orderId && (
                        <div className="flex justify-between text-gray-400 mb-1 text-xs">
                            <span>Order ID</span>
                            <span className="font-mono">{paymentDetails.orderId}</span>
                        </div>
                    )}
                    <div className="border-t border-white/5 my-2 pt-2 flex justify-between">
                        <span className="text-white font-bold">Amount Paid</span>
                        <span className="text-purple-400 font-bold">₹{calculateFinalPrice()}</span>
                    </div>
                </div>

                {/* Prominent WhatsApp Button */}
                <div className="max-w-sm mx-auto space-y-3">
                    <button
                        onClick={() => {
                            console.log("Manual WhatsApp button clicked");
                            console.log("Current paymentDetails state:", paymentDetails);
                            redirectToWhatsApp("success", paymentDetails || undefined);
                        }}
                        className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        <span>Continue to WhatsApp</span>
                    </button>
                    
                    <p className="text-xs text-gray-500">
                        Click above to share your enrollment details with our team
                    </p>

                    {isModal && onClose && (
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-2.5 border border-white/5 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Close
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    if (isUserLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-20 bg-white/5 rounded-xl" />
                <div className="space-y-3">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
                    </div>
                </div>
                <div className="h-40 bg-white/5 rounded-xl" />
            </div>
        );
    }

    if (!user && !skipLoginRequired) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <div className={`relative bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm ${fullWidth ? "max-w-xl mx-auto" : ""}`}>
                    <div className="relative z-10 space-y-4">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative mx-auto w-12 h-12"
                        >
                            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Typography */}
                        <div className="space-y-2">
                            <motion.h3
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg font-bold text-gray-900"
                            >
                                Unlock Your Potential
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="text-gray-600 text-xs max-w-xs mx-auto"
                            >
                                Sign in to view pricing and enroll in{" "}
                                <span className="font-semibold text-purple-600">
                                    {course.title}
                                </span>
                            </motion.p>
                        </div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-2"
                        >
                            <button
                                onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all text-sm flex items-center justify-center gap-2"
                            >
                                Sign In to Continue
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>

                            <button
                                onClick={() => router.push(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`)}
                                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-semibold transition-all text-sm"
                            >
                                Create New Account
                            </button>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="flex items-center justify-center gap-3 pt-2"
                        >
                            <div className="flex -space-x-2">
                                {[
                                    { color: 'from-purple-400 to-purple-600', letter: 'A' },
                                    { color: 'from-pink-400 to-pink-600', letter: 'B' },
                                    { color: 'from-blue-400 to-blue-600', letter: 'C' }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + (i * 0.05) }}
                                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.color} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold`}
                                    >
                                        {item.letter}
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="text-gray-900 text-xs font-bold">Join 1,000+</div>
                                <div className="text-gray-500 text-[10px]">Active Students</div>
                            </div>
                        </motion.div>

                        {/* Feature badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap items-center justify-center gap-2 pt-1"
                        >
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                                <ShieldCheck size={10} className="text-green-600" />
                                <span className="text-[9px] font-semibold text-gray-600 uppercase">Secure</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                                <Zap size={10} className="text-yellow-600" />
                                <span className="text-[9px] font-semibold text-gray-600 uppercase">Instant Access</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                                <Award size={10} className="text-purple-600" />
                                <span className="text-[9px] font-semibold text-gray-600 uppercase">Certified</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
            />

            {/* Show error if no pricing configured */}
            {!hasPricing ? (
                <div className="bg-red-900/10 border border-red-900/20 rounded-3xl p-8 text-center backdrop-blur-xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Pricing Not Configured</h3>
                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                        This course doesn't have pricing configured yet. Please contact our support team for assistance.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold transition-all hover:scale-105 active:scale-95"
                    >
                        Contact Support
                        <ChevronRight size={18} />
                    </Link>
                </div>
            ) : (
                <div className={`grid grid-cols-1 ${fullWidth ? "lg:grid-cols-12" : ""} gap-8 items-start`}>
                    {/* Left Column: Selection & Options */}
                    <div className={`${fullWidth ? "lg:col-span-8" : ""} space-y-10`}>
                        {/* Course Info Card (Mobile Only) */}
                        <div className={`lg:hidden flex items-center gap-4 p-5 rounded-3xl backdrop-blur-sm ${theme === 'light' ? 'bg-gray-50 border border-gray-400' : 'bg-white/[0.03] border border-white/20'}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-600/10 text-purple-400'}`}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold leading-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{course.title}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest mt-1">{course.category?.name || 'Academy'}</p>
                            </div>
                        </div>

                        {/* 1. Choose Class Batch & Timing (Comes FIRST) */}
                        <section className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h4 className={`font-black uppercase tracking-widest text-xs flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    1. Select Class Batch & Timing
                                </h4>
                            </div>

                            {/* Batch Category Selection - Responsive 3-Column Equal Grid */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                {['Morning', 'Afternoon', 'Evening'].map((category) => {
                                    const categoryLower = category.toLowerCase();
                                    const hasBatches = (course.courseTimings || []).some(ct =>
                                        ct.timing?.name?.toLowerCase().includes(categoryLower)
                                    );

                                    if (!hasBatches) return null;

                                    const categoryTimings = (course.courseTimings || [])
                                        .filter(ct => ct.timing?.name?.toLowerCase().includes(categoryLower))
                                        .map(ct => ct.timing?.startTime && ct.timing?.endTime ? `${ct.timing.startTime}-${ct.timing.endTime}` : '')
                                        .filter(Boolean);

                                    const isSelected = selectedBatchCategory === categoryLower;

                                    return (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedBatchCategory(categoryLower);
                                                setSelectedTiming(''); // Reset timing when changing category
                                                
                                                if (isYoga) {
                                                    trackMetaEvent('Batch_Selected', {
                                                        batch: category
                                                    }, formData, true);
                                                }
                                            }}
                                            className={`flex items-center justify-center py-4 sm:py-5 px-3 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 border text-center ${
                                                isSelected
                                                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-500"
                                                    : theme === 'light'
                                                        ? "bg-white border-gray-300 text-gray-800 hover:border-purple-300 hover:bg-purple-50/40 shadow-sm"
                                                        : "bg-white/5 border-white/10 text-gray-300 hover:border-purple-500/50 hover:text-purple-400"
                                            }`}
                                        >
                                            <span>{category}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Time Slot Selection */}
                            {selectedBatchCategory && (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(() => {
                                            const categoryBatches = (course.courseTimings || [])
                                                .filter(ct => ct.timing?.name?.toLowerCase().includes(selectedBatchCategory))
                                                .map((ct, index) => ({
                                                    id: ct.timing?.id || `timing-${index}`,
                                                    name: ct.timing?.name || '',
                                                    time: ct.timing?.startTime && ct.timing?.endTime
                                                        ? `${ct.timing.startTime} - ${ct.timing.endTime}`
                                                        : '',
                                                    fullDisplay: `${ct.timing?.name || ''} ${ct.timing?.startTime || ''}-${ct.timing?.endTime || ''}`.trim(),
                                                }))
                                                .filter(t => t.time);

                                            return categoryBatches.map((timing) => {
                                                const isSlotSelected = selectedTiming === timing.fullDisplay;
                                                return (
                                                    <button
                                                        key={timing.id}
                                                        onClick={() => {
                                                            setSelectedTiming(timing.fullDisplay);
                                                            setErrors(prev => ({ ...prev, timing: false }));
                                                        }}
                                                        className={`p-4 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between ${
                                                            isSlotSelected
                                                                ? "bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20"
                                                                : theme === 'light'
                                                                    ? "bg-white border-gray-300 text-gray-800 hover:border-purple-500 hover:bg-purple-50/30 shadow-sm"
                                                                    : "bg-white/5 border-white/20 text-gray-300 hover:border-purple-500/50 hover:bg-white/10"
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className={`text-xs font-semibold mb-0.5 ${isSlotSelected ? "text-purple-100" : "text-gray-500"}`}>{timing.name}</div>
                                                            <div className="text-sm sm:text-base font-bold">{timing.time}</div>
                                                        </div>
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSlotSelected ? "border-white bg-white" : (theme === 'light' ? "border-gray-400" : "border-white/20")}`}>
                                                            {isSlotSelected && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                                                        </div>
                                                    </button>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            )}

                            {errors.timing && (
                                <div id="error-timing" className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 text-xs font-semibold">Please select a class batch to continue</p>
                                </div>
                            )}
                        </section>

                        {/* 2. Select Your Plan (Comes SECOND: Trial -> 1 Month -> 3 Months -> 6 Months) */}
                        <section className="space-y-5">
                            <div className="flex items-center justify-between">
                                <h4 className={`font-black uppercase tracking-widest text-xs flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    2. Select Your Plan
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pricingOptions.map((option) => {
                                    const labelLower = option.label.toLowerCase();
                                    const isTrial = labelLower.includes('trial') || labelLower.includes('demo');
                                    const is3M = labelLower.includes('3 month');
                                    const is6M = labelLower.includes('6 month');

                                    let badgeText = "";
                                    if (isTrial) badgeText = "Demo Class";
                                    else if (is3M) badgeText = "Popular";
                                    else if (is6M) badgeText = "Best Value";

                                    const isSelected = selectedPricingId === option.id;

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSelectedPricingId(option.id);
                                                setErrors(prev => ({ ...prev, plan: false }));
                                                
                                                if (isYoga) {
                                                    trackMetaEvent('Plan_Selected', {
                                                        plan: option.label,
                                                        price: option.discounted
                                                    }, formData, true);
                                                }
                                            }}
                                            className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                                                isSelected
                                                    ? "border-purple-500 bg-purple-500/10 shadow-md ring-1 ring-purple-500"
                                                    : theme === 'light'
                                                        ? "border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50/30 shadow-sm"
                                                        : "border-white/20 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
                                            }`}
                                        >
                                            {badgeText && (
                                                <div className={`absolute -top-2.5 right-3 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm z-10 ${
                                                    is6M
                                                        ? "bg-purple-600 text-white"
                                                        : is3M
                                                            ? "bg-amber-500 text-white"
                                                            : "bg-emerald-600 text-white"
                                                }`}>
                                                    {badgeText}
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center mb-2">
                                                <div className={`font-bold text-base sm:text-lg ${isSelected ? (theme === 'light' ? "text-gray-900" : "text-white") : (theme === 'light' ? "text-gray-800" : "text-gray-200")}`}>
                                                    {option.label}
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? "border-purple-500 bg-purple-500" : (theme === 'light' ? "border-gray-400" : "border-white/20")}`}>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-2xl sm:text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{option.discounted}</span>
                                                {option.original > option.discounted && (
                                                    <span className={`text-xs sm:text-sm line-through font-medium ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>₹{option.original}</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.plan && (
                                <div id="error-plan" className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <p className="text-red-400 text-xs font-semibold">Please select a plan to continue</p>
                                </div>
                            )}
                        </section>

                        {/* Trust Badges (Comes THIRD) */}
                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200/50">
                            {[
                                { icon: Award, label: 'Certified' },
                                { icon: Users, label: '5k+ Students' },
                                { icon: Star, label: '4.9 Rating' }
                            ].map((badge, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${theme === 'light' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-white/5 text-purple-400 border border-white/10'}`}>
                                        <badge.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details & Payment */}
                    <div className={`${fullWidth ? "lg:col-span-4 lg:sticky lg:top-24" : ""} space-y-6`}>
                        <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${theme === 'light' ? 'bg-white border-gray-400' : 'bg-neutral-900 border-white/20'}`}>
                            <div className="relative space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className={`font-black uppercase tracking-widest text-xs flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                                        Checkout
                                    </h4>
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck size={14} className="text-green-500" />
                                        <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Secure</span>
                                    </div>
                                </div>

                                {/* Enrollment Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* User Details Section */}
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
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
                                                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none transition-all text-sm font-medium ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border-gray-400 focus:border-purple-600' : 'bg-white/5 text-white placeholder:text-gray-500 border-white/20 focus:border-purple-500'} ${errors.name ? "border-red-500 bg-red-500/10" : ""}`}
                                            />
                                            {errors.name && <p id="error-name" className="text-red-400 text-xs font-semibold mt-1.5 ml-1">Name is required</p>}
                                        </div>

                                        <div className="relative">
                                            <Phone size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
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
                                                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none transition-all text-sm font-medium ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border-gray-400 focus:border-purple-600' : 'bg-white/5 text-white placeholder:text-gray-500 border-white/20 focus:border-purple-500'} ${errors.phone ? "border-red-500 bg-red-500/10" : ""}`}
                                            />
                                            {errors.phone && <p id="error-phone" className="text-red-400 text-xs font-semibold mt-1.5 ml-1">Phone is required</p>}
                                        </div>

                                        <div className="relative">
                                            <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
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
                                                placeholder="Email"
                                                className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none transition-all text-sm font-medium ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border-gray-400 focus:border-purple-600' : 'bg-white/5 text-white placeholder:text-gray-500 border-white/20 focus:border-purple-500'} ${errors.email ? "border-red-500 bg-red-500/10" : ""}`}
                                            />
                                            {errors.email && <p id="error-email" className="text-red-400 text-xs font-semibold mt-1.5 ml-1">Email is required</p>}
                                        </div>
                                    </div>

                                    {/* Price Summary */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className={`font-medium text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Subtotal</span>
                                            <span className={`font-bold text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{selectedPricing.discounted}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between items-center text-green-600">
                                                <span className="font-medium text-sm flex items-center gap-2">
                                                    <Tag size={14} />
                                                    Coupon Discount
                                                </span>
                                                <span className="font-bold text-base">
                                                    -₹{appliedCoupon.discountType === 'percentage'
                                                        ? Math.round((selectedPricing.discounted * appliedCoupon.discountValue) / 100)
                                                        : appliedCoupon.discountValue}
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex justify-between items-center pt-3 border-t ${theme === 'light' ? 'border-gray-400' : 'border-white/20'}`}>
                                            <div>
                                                <div className={`font-black text-base uppercase tracking-wide ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Total Amount</div>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                <span className={`font-black text-3xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>₹{calculateFinalPrice()}</span>
                                                <div className={`text-xs font-bold uppercase ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                                                    Saved ₹{selectedPricing.original - calculateFinalPrice()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Missing Fields Summary */}
                                    {Object.keys(errors).length > 0 && (
                                        <div className="p-4 bg-red-500/10 border border-red-500 rounded-xl space-y-2">
                                            <p className="text-red-400 text-sm font-bold flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Please complete the form:
                                            </p>
                                            <ul className="text-red-400 text-xs space-y-1 ml-6">
                                                {errors.plan && <li>• Select a plan</li>}
                                                {errors.timing && <li>• Choose a batch</li>}
                                                {errors.name && <li>• Enter name</li>}
                                                {errors.phone && <li>• Enter phone</li>}
                                                {errors.email && <li>• Enter email</li>}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isRazorpayProcessing}
                                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wide text-sm transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        {isSubmitting || isRazorpayProcessing ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <CreditCard size={20} />
                                                <span>Pay & Enroll Now</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-green-400">
                                            <ShieldCheck size={14} className="text-green-500" />
                                            <span className="uppercase tracking-wide">Secure</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                                            <Zap size={14} className="text-purple-500" />
                                            <span className="uppercase tracking-wide">Instant</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                courseName={course.title}
            />
        </div >
    );
};
