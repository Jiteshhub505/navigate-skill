'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { RazorpayOptions, RazorpayResponse } from '@/types/razorpay';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import LoginRequiredModal from '@/components/ui/LoginRequiredModal';

interface PaymentButtonProps {
    amount: number;
    courseName: string;
    courseDescription?: string;
    courseId?: string;
    durationId?: string;
    couponCode?: string;
    onSuccess?: (response: RazorpayResponse) => void;
    onError?: (error: any) => void;
    className?: string;
    children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
    amount,
    courseName,
    courseDescription,
    courseId,
    durationId,
    couponCode,
    onSuccess,
    onError,
    className = '',
    children,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'cancelled'>('idle');
    const [successDetails, setSuccessDetails] = useState<{ paymentId?: string; orderId?: string } | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const redirectToWhatsApp = (status: "success" | "cancelled", details?: { paymentId?: string; orderId?: string }) => {
        let phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9218187041";
        phoneNumber = phoneNumber.replace(/[\s\-+]/g, '');
        if (phoneNumber.length === 10 || !phoneNumber.startsWith('91')) {
            phoneNumber = '91' + phoneNumber;
        }

        let message = `Hi, I'm interested in the ${courseName} course.\n\n`;
        message += `*Details:*\n`;
        message += `- Amount: ₹${amount / 100}\n`;
        message += `- Status: ${status === "success" ? "Payment Successful ✅" : "Payment Cancelled/Failed ❌"}`;

        if (status === "success" && details) {
            if (details.paymentId) message += `\n- Transaction ID: ${details.paymentId}`;
            if (details.orderId) message += `\n- Order ID: ${details.orderId}`;
        }

        message += `\n\nPlease provide further details.`;

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

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setIsLoading(false);
                setShowLoginModal(true);
                return;
            }
            // 1. Create order on the server
            const response = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // prefer server-side calculation of final amount using ids
                    courseId,
                    durationId,
                    couponCode,
                    receipt: `rcpt_${Date.now()}`,
                }),
            });

            const order = await response.json();

            if (order.error) {
                throw new Error(order.error);
            }

            // 2. Initialize Razorpay options
            const options: RazorpayOptions = {
                // use public key from order or env
                key: order.key_id || order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: 'Antigravity Courses',
                description: courseDescription || `Enroll in ${courseName}`,
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    // 3. Verify payment on the server
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(response),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        if (onSuccess) onSuccess(response);
                        const details = {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id
                        };
                        setSuccessDetails(details);
                        setPaymentStatus('success');
                        setTimeout(() => {
                            redirectToWhatsApp('success', details);
                        }, 1000);
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.user_metadata?.full_name || '',
                    email: user.email || '',
                    contact: '',
                },
                theme: {
                    color: '#3B82F6', // Primary blue color
                },
                modal: {
                    ondismiss: function () {
                        redirectToWhatsApp("cancelled");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                if (onError) onError(response.error);
                redirectToWhatsApp("cancelled");
            });
        } catch (error: any) {
            console.error('Error in payment process:', error);
            if (onError) onError(error);
            alert(error?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Payment Successful!</h2>
                <p className="text-green-700 mb-6">Thank you for enrolling in {courseName}. Please contact us on WhatsApp for further details.</p>
                <button
                    onClick={() => redirectToWhatsApp("success", successDetails || {})}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    Contact on WhatsApp
                </button>
            </div>
        );
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                {isLoading ? 'Processing...' : children || 'Enroll Now'}
            </button>

            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                courseName={courseName}
            />
        </>
    );
};

export default PaymentButton;
