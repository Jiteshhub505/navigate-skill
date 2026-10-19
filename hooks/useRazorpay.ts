'use client';

import { useState } from 'react';
import { RazorpayOptions, RazorpayResponse } from '@/types/razorpay';
import { createClient } from '@/lib/supabase/client';

export const useRazorpay = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const supabase = createClient();

    const checkRazorpayLoaded = () => {
        return typeof window !== 'undefined' && (window as any).Razorpay;
    };

    const processPayment = async ({
        amount,
        courseId,
        durationId,
        couponCode,
        courseName,
        courseDescription,
        userName,
        userEmail,
        userPhone,
        timing,
        onSuccess,
        onError,
        onCancel,
        skipAuthCheck = false,
    }: {
        amount: number;
        courseId: string;
        durationId: string;
        couponCode?: string;
        courseName: string;
        courseDescription?: string;
        userName?: string;
        userEmail?: string;
        userPhone?: string;
        timing?: string;
        onSuccess?: (response: any) => void;
        onError?: (error: any) => void;
        onCancel?: () => void;
        skipAuthCheck?: boolean;
    }) => {
        if (!checkRazorpayLoaded()) {
            alert('Razorpay SDK failed to load. Please check your internet connection.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!skipAuthCheck && !user) {
            alert('Please login to enroll in this course');
            window.location.href = '/login';
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create order on the server
            const response = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    durationId,
                    couponCode,
                    timing,
                    userName,
                    userEmail,
                    userPhone,
                    guestUser: {
                        name: userName,
                        email: userEmail,
                        phone: userPhone,
                    },
                }),
            });
            console.log("Razorpay", response)
            const order = await response.json();
            console.log("Order", order)
            if (order.error) {
                throw new Error(order.error);
            }

            // 2. Initialize Razorpay options
            const options: RazorpayOptions = {
                // use public key from order or env
                key: order.key_id || order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: 'Navigate Skills',
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
                    console.log("Verify data", verifyData)
                    if (verifyData.success) {
                        if (onSuccess) onSuccess({
                            ...response,
                            receipt: order.receipt
                        });
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: userName || '',
                    email: userEmail || user?.email || '',
                    contact: userPhone || '',
                },
                theme: {
                    color: '#9333ea',
                },
                modal: {
                    ondismiss: function () {
                        if (onCancel) onCancel();
                    }
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                console.error('Payment failed:', response.error);
                if (onError) onError(response.error);
            });
        } catch (error: any) {
            console.error('Error in payment process:', error);
            if (onError) onError(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        processPayment,
        isProcessing,
    };
};
