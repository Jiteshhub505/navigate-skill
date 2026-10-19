'use server'

import { db } from '@/lib/db'
import { coupons, couponCourses } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { couponCodes as hardcodedCoupons } from '@/lib/constants'

export type CouponValidationResult =
    | { error: string; code?: never; discountType?: never; discountValue?: never }
    | { error?: never; code: string; discountType: 'percentage' | 'fixed'; discountValue: number };

export async function validateCouponAction(code: string, courseId: string, amount: number): Promise<CouponValidationResult> {
    const normalizedCode = code.toUpperCase().trim();

    // 1. Try to find in database
    const couponRecord = await db.query.coupons.findFirst({
        where: and(eq(coupons.code, normalizedCode), eq(coupons.isActive, true), isNull(coupons.deletedAt)),
        with: {
            couponCourses: true
        }
    });

    if (couponRecord) {
        // Check if coupon is valid for this course (if no courses linked, it's global)
        const isGlobal = !couponRecord.couponCourses || couponRecord.couponCourses.length === 0;
        const isValidForCourse = isGlobal || couponRecord.couponCourses.some((cc: any) => cc.courseId === courseId);

        // Check validity dates
        const now = new Date();
        const validFrom = couponRecord.validFrom ? new Date(couponRecord.validFrom) : null;
        const validUntil = couponRecord.validUntil ? new Date(couponRecord.validUntil) : null;
        const isValidDate = (!validFrom || now >= validFrom) && (!validUntil || now <= validUntil);

        // Check min purchase
        const minPurchase = Number(couponRecord.minPurchaseAmount || 0);
        const isMinPurchaseMet = amount >= minPurchase;

        if (!isValidForCourse) return { error: 'This coupon is not valid for this course' };
        if (!isValidDate) return { error: 'This coupon has expired' };
        if (!isMinPurchaseMet) return { error: `Minimum purchase of ₹${minPurchase} required` };

        return {
            code: couponRecord.code,
            discountType: couponRecord.discountType as 'percentage' | 'fixed',
            discountValue: Number(couponRecord.discountValue),
        };
    }

    // 2. Fallback to hardcoded coupons
    const hardcodedCoupon = hardcodedCoupons.find((c: any) => c.code === normalizedCode);

    if (hardcodedCoupon) {
        const today = new Date();
        const validTill = new Date(hardcodedCoupon.validTill);

        if (today > validTill) return { error: 'This coupon has expired' };

        const minPurchase = hardcodedCoupon.minPurchase || 0;
        if (amount < minPurchase) return { error: `Minimum purchase of ₹${minPurchase} required` };

        return {
            code: hardcodedCoupon.code,
            discountType: 'percentage',
            discountValue: hardcodedCoupon.discountPercent,
        };
    }

    return { error: 'Invalid coupon code' };
}
