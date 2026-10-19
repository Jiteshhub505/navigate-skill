import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { courses, coupons, orders, users } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';
import { couponCodes as hardcodedCoupons } from '@/lib/constants';
import { validateCouponAction } from '@/app/actions/coupons';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { courseId, durationId, couponCode, currency = 'INR', guestUser, timing, userName, userEmail, userPhone } = await request.json();

        const effectivePhone = userPhone || guestUser?.phone || null;
        const effectiveName = userName || guestUser?.name || null;
        const effectiveEmail = userEmail || guestUser?.email || null;

        // Allow guest users if guestUser data is provided
        if (!user && !guestUser && !effectiveEmail) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        // Fetch course with pricings
        const course = await db.query.courses.findFirst({
            where: and(eq(courses.id, courseId), isNull(courses.deletedAt)),
            with: {
                coursePricings: true
            }
        });

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Find the specific pricing for the selected duration
        const selectedPricing = course.coursePricings?.find((p: any) => p.durationId === durationId)
            || course.coursePricings?.[0]; // Fallback to first pricing if durationId not found

        if (!selectedPricing) {
            return NextResponse.json({ error: 'Pricing not found for this course' }, { status: 404 });
        }

        let finalAmount = Number(selectedPricing.discountedPrice);
        let discount = 0;
        let couponRecord: any = null;

        // Apply coupon if provided
        if (couponCode) {
            const result = await validateCouponAction(couponCode, courseId, finalAmount);

            if (result.code) {
                const discountValue = result.discountValue;
                if (result.discountType === 'percentage') {
                    discount = (finalAmount * discountValue) / 100;
                } else {
                    discount = discountValue;
                }
                finalAmount -= discount;

                // For DB persistence, we still want to know if it was a DB coupon
                // We can do a quick check here or just store the code
                couponRecord = await db.query.coupons.findFirst({
                    where: eq(coupons.code, result.code)
                });
            }
        }

        // Ensure amount is not negative and round it to match UI display
        finalAmount = Math.max(0, Math.round(finalAmount));

        const options = {
            amount: finalAmount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: user?.id || 'guest',
                userEmail: effectiveEmail || user?.email || '',
                userName: effectiveName || '',
                userPhone: effectivePhone || '',
                timing: timing || '',
                courseId,
                durationId,
                couponCode: couponCode || '',
                courseTitle: course.title,
                courseDescription: course.description,
            }
        };

        const order = await razorpay.orders.create(options);

        const serverKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

        // If we've already persisted this razorpay order id, skip inserting again.
        const existingOrder = await db.query.orders.findFirst({ where: eq(orders.razorpayOrderId, order.id) });
        if (existingOrder) {
            return NextResponse.json({ ...order, key_id: serverKeyId });
        }

        // Resolve an app user id to associate with this order.
        // For guest users, create a user record with the provided information.
        // Prefer the users row with the same auth id; if missing, try to find by email and use that id.
        // Only create a new users row with the auth id if no email match exists.
        try {
            let orderUserId: string;

            if (user) {
                // Authenticated user flow
                orderUserId = user.id;

                const existingById = await db.query.users.findFirst({ where: eq(users.id, user.id) });
                if (!existingById) {
                    // Try to find existing users row by email
                    const existingByEmail = user.email ? await db.query.users.findFirst({ where: eq(users.email, user.email as string) }) : null;
                    if (existingByEmail) {
                        orderUserId = existingByEmail.id;
                        if (effectivePhone) {
                            await db.update(users).set({ phone: effectivePhone }).where(eq(users.id, existingByEmail.id));
                        }
                    } else {
                        // No existing user by email — create a minimal user row using the auth id
                        try {
                            await db.insert(users).values({
                                id: user.id,
                                email: (user.email as string) || '',
                                name: effectiveName || (user.user_metadata as any)?.full_name || (user.email as string) || 'User',
                                phone: effectivePhone || null,
                                role: 'student',
                                approvalStatus: 'approved',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                        } catch (createErr) {
                            console.error('Failed to create users row for auth user:', createErr);
                            orderUserId = user.id;
                        }
                    }
                } else {
                    if (effectivePhone && !existingById.phone) {
                        await db.update(users).set({ phone: effectivePhone }).where(eq(users.id, existingById.id));
                    }
                    if (effectiveName && (!existingById.name || existingById.name === 'User')) {
                        await db.update(users).set({ name: effectiveName }).where(eq(users.id, existingById.id));
                    }
                }
            } else {
                // Guest user flow - check if user exists by email, otherwise create new
                const guestEmail = effectiveEmail || '';
                const existingByEmail = await db.query.users.findFirst({ where: eq(users.email, guestEmail) });
                
                if (existingByEmail) {
                    orderUserId = existingByEmail.id;
                    if (effectivePhone) {
                        await db.update(users).set({ phone: effectivePhone }).where(eq(users.id, existingByEmail.id));
                    }
                } else {
                    // Create a new guest user record
                    const guestUserId = randomUUID();
                    await db.insert(users).values({
                        id: guestUserId,
                        email: guestEmail,
                        name: effectiveName || 'Guest User',
                        phone: effectivePhone || null,
                        role: 'student',
                        approvalStatus: 'approved',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                    orderUserId = guestUserId;
                }
            }

            // Persist a pending order server-side to make the flow authoritative
            // Avoid inserting many duplicate pending orders: if there's already a recent pending order
            // for this user+course, skip inserting another. This prevents duplicate rows when the
            // client retries or sends multiple requests quickly.
            const recentPending = await db.query.orders.findMany({
                where: and(
                    eq(orders.userId, orderUserId),
                    eq(orders.courseId, courseId),
                    eq(orders.status, 'pending')
                ),
            });

            if (recentPending && recentPending.length > 0) {
                const mostRecent = recentPending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                const ageMs = Date.now() - new Date(mostRecent.createdAt).getTime();
                if (ageMs < 2 * 60 * 1000) { // 2 minutes
                    // Skip inserting — return order to client
                    return NextResponse.json({ ...order, key_id: serverKeyId });
                }
            }

            await db.insert(orders).values({
                id: randomUUID(),
                userId: orderUserId,
                courseId,
                durationId: durationId || null, // Save duration for expiration tracking
                amount: finalAmount.toString(),
                couponId: couponRecord?.id || null,
                discountAmount: discount ? discount.toString() : null,
                finalAmount: finalAmount.toString(),
                status: 'pending',
                timing: timing || null,
                razorpayOrderId: order.id,
            });
        } catch (err) {
            console.error('Failed to persist pending order:', err);
            // continue — we still return the razorpay order so client can proceed
        }

        return NextResponse.json({ ...order, key_id: serverKeyId });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: 'Failed to create order', details: error.message },
            { status: 500 }
        );
    }
}
