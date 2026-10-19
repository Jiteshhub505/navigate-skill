import { db } from '../lib/db';
import { coursePricings, courses, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Deactivates the 1 Month ₹300 pricing option for Yoga course
 */
async function remove1Month300Pricing() {
    console.log('🔧 Removing 1 Month ₹300 pricing option...\n');

    try {
        // Find the Yoga course
        const yogaCourse = await db.query.courses.findFirst({
            where: eq(courses.slug, 'yoga')
        });

        if (!yogaCourse) {
            console.error('❌ Yoga course not found');
            return;
        }

        console.log(`✅ Found Yoga course: ${yogaCourse.id}\n`);

        // Find 1 Month duration
        const oneMonth = await db.query.durations.findFirst({
            where: eq(durations.name, '1 Month')
        });

        if (!oneMonth) {
            console.error('❌ 1 Month duration not found');
            return;
        }

        // Find and deactivate the 1 Month pricing with ₹300
        const oneMonthPricing = await db.query.coursePricings.findFirst({
            where: and(
                eq(coursePricings.courseId, yogaCourse.id),
                eq(coursePricings.durationId, oneMonth.id)
            )
        });

        if (oneMonthPricing) {
            await db.update(coursePricings)
                .set({
                    isActive: false,
                    updatedAt: new Date()
                })
                .where(eq(coursePricings.id, oneMonthPricing.id));

            console.log(`✅ Deactivated 1 Month pricing (was ₹${oneMonthPricing.discountedPrice})`);
        } else {
            console.log(`⚠️  1 Month pricing not found`);
        }

        console.log('\n✨ 1 Month pricing deactivated successfully!\n');

    } catch (error) {
        console.error('❌ Error deactivating pricing:', error);
        process.exit(1);
    }

    process.exit(0);
}

remove1Month300Pricing();
