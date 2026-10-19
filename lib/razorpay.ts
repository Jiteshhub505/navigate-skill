import Razorpay from 'razorpay';

let _razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (_razorpayInstance) return _razorpayInstance;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
            console.warn('Razorpay keys not configured in environment.');
        }
        return new Razorpay({
            key_id: keyId || 'rzp_test_placeholder',
            key_secret: keySecret || 'placeholder_secret',
        });
    }

    _razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
    });

    return _razorpayInstance;
}

export const razorpay = new Proxy({} as Razorpay, {
    get(_target, prop) {
        const instance = getRazorpay();
        const val = (instance as any)[prop];
        if (typeof val === 'function') {
            return val.bind(instance);
        }
        return val;
    }
});
