import { db } from '../lib/db';
import { coursePricings, courses, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates Yoga course pricing to summer special:
 * - 1 Month: ₹599
 * - 6 Months: ₹999
 * - Trial: Keep as is (₹10)
 */
async function updateYogaSummerPricing() {
    console.log('🔧 Updating Yoga course pricing to summer special...\n');

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

        // Find durations
        const oneMonth = await db.query.durations.findFirst({
            where: eq(durations.name, '1 Month')
        });

        const sixMonths = await db.query.durations.findFirst({
            where: eq(durations.name, '6 Months')
        });

        const trial = await db.query.durations.findFirst({
            where: eq(durations.name, 'Trial')
        });

        // Update 1 Month: ₹599
        if (oneMonth) {
            const oneMonthPricing = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, oneMonth.id)
                )
            });

            if (oneMonthPricing) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '999.00',
                        discountedPrice: '599.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, oneMonthPricing.id));

                console.log(`✅ Updated 1 Month: ₹999 → ₹599`);
            } else {
                // Create if doesn't exist
                await db.insert(coursePricings).values({
                    courseId: yogaCourse.id,
                    durationId: oneMonth.id,
                    originalPrice: '999.00',
                    discountedPrice: '599.00',
                    currency: 'INR',
                    isActive: true,
                });
                console.log(`✅ Created 1 Month pricing: ₹599`);
            }
        }

        // Update 6 Months: ₹999
        if (sixMonths) {
            const sixMonthsPricing = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, sixMonths.id)
                )
            });

            if (sixMonthsPricing) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '1999.00',
                        discountedPrice: '999.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, sixMonthsPricing.id));

                console.log(`✅ Updated 6 Months: ₹1999 → ₹999`);
            } else {
                // Create if doesn't exist
                await db.insert(coursePricings).values({
                    courseId: yogaCourse.id,
                    durationId: sixMonths.id,
                    originalPrice: '1999.00',
                    discountedPrice: '999.00',
                    currency: 'INR',
                    isActive: true,
                });
                console.log(`✅ Created 6 Months pricing: ₹999`);
            }
        }

        // Keep Trial as is - just confirm it exists
        if (trial) {
            const trialPricing = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, trial.id)
                )
            });

            if (trialPricing) {
                console.log(`✅ Trial pricing kept as: ₹${trialPricing.discountedPrice}`);
            } else {
                console.log(`⚠️  Trial pricing not found, keeping it unchanged`);
            }
        }

        console.log('\n✨ Yoga summer pricing updated successfully!\n');

    } catch (error) {
        console.error('❌ Error updating pricing:', error);
        process.exit(1);
    }

    process.exit(0);
}

updateYogaSummerPricing();
