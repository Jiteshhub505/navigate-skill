import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { orders, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // hardcode test secret for now
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            console.error('RAZORPAY_KEY_SECRET is not defined');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { message: 'Invalid signature', success: false },
                { status: 400 }
            );
        }

        // Find the server-side order and mark it completed
        const dbOrder = await db.query.orders.findFirst({
            where: eq(orders.razorpayOrderId, razorpay_order_id),
        });

        if (dbOrder) {
            await db.update(orders).set({
                status: 'completed',
                razorpayPaymentId: razorpay_payment_id,
            }).where(eq(orders.id, dbOrder.id));

            // Send confirmation email to the user (server-side)
            try {
                const userRow = await db.query.users.findFirst({ where: eq(users.id, dbOrder.userId) });
                const to = userRow?.email;
                if (to) {
                    await resend.emails.send({
                        from: 'Courses <onboarding@resend.dev>',
                        to: [to],
                        subject: 'Payment Successful – Course Enrollment Confirmed',
                        html: `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <h2 style="color: #111;">Payment Successful 🎉</h2>
    <p>Hi ${userRow?.name || 'there'},</p>
    <p>We’re happy to inform you that your payment has been successfully received, and your enrollment is now confirmed.</p>
    <div style="background-color: #f6f6f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Order ID:</strong> ${razorpay_order_id}</p>
      <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
      <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${dbOrder.amount}</p>
      ${dbOrder.timing ? `<p style="margin: 5px 0;"><strong>Class Batch & Timing:</strong> ${dbOrder.timing}</p>` : ''}
    </div>
    <p>You can now access your course from your dashboard. If you have any questions or need help, feel free to reply to this email.</p>
    <p style="margin-top: 30px;">Best regards,<br /><strong>The Courses Team</strong></p>
    <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #777;">This is an automated email. Please do not share your payment details with anyone.</p>
  </div>
`,
                    });
                }
            } catch (err) {
                console.error('Failed to send confirmation email:', err);
            }
        }
        else {
            console.warn('No matching DB order found for razorpay_order_id:', razorpay_order_id);
        }

        return NextResponse.json({ message: 'Payment verified successfully', success: true });
    } catch (error: any) {
        console.error('Error verifying Razorpay payment:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
