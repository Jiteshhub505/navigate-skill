import { db } from '../lib/db';
import { coursePricings, courses, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates Yoga course pricing to show discounts:
 * - 1 Month: ₹599 → ₹300
 * - Trial: ₹50 → ₹10
 * - Deactivate 6 Months option
 */
async function updateYogaFinalPricing() {
    console.log('🔧 Updating Yoga course pricing with discounts...\n');

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

        // Update 1 Month: Original ₹599, Discounted ₹300
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
                        originalPrice: '599.00',
                        discountedPrice: '300.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, oneMonthPricing.id));

                console.log(`✅ Updated 1 Month: ₹599 → ₹300`);
            }
        }

        // Update Trial: Original ₹50, Discounted ₹10
        if (trial) {
            const trialPricing = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, trial.id)
                )
            });

            if (trialPricing) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '50.00',
                        discountedPrice: '10.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, trialPricing.id));

                console.log(`✅ Updated Trial: ₹50 → ₹10`);
            }
        }

        // Deactivate 6 Months
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
                        isActive: false,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, sixMonthsPricing.id));

                console.log(`✅ Deactivated 6 Months option`);
            }
        }

        console.log('\n✨ Yoga pricing updated successfully!\n');

    } catch (error) {
        console.error('❌ Error updating pricing:', error);
        process.exit(1);
    }

    process.exit(0);
}

updateYogaFinalPricing();
