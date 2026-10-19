import { db } from '../lib/db';
import { coursePricings, courses, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates Yoga course pricing to:
 * - 1 Month: ₹300
 * - Trial: ₹10
 */
async function updateYogaTrialPricing() {
    console.log('🔧 Updating Yoga course pricing with trial option...\n');

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

        if (!oneMonth) {
            console.error('❌ Could not find 1 Month duration');
            return;
        }

        // Update 1 Month pricing to ₹300
        const oneMonthPricing = await db.query.coursePricings.findFirst({
            where: and(
                eq(coursePricings.courseId, yogaCourse.id),
                eq(coursePricings.durationId, oneMonth.id)
            )
        });

        if (oneMonthPricing) {
            await db.update(coursePricings)
                .set({
                    originalPrice: '300.00',
                    discountedPrice: '300.00',
                    updatedAt: new Date()
                })
                .where(eq(coursePricings.id, oneMonthPricing.id));

            console.log(`✅ Updated 1 Month: ₹${oneMonthPricing.discountedPrice} → ₹300`);
        }

        // Check if Trial duration exists, if not create it
        let trialDuration = await db.query.durations.findFirst({
            where: eq(durations.name, 'Trial')
        });

        if (!trialDuration) {
            console.log('⚠️  Trial duration not found, creating it...');
            const [newDuration] = await db.insert(durations).values({
                name: 'Trial',
                value: 1,
                unit: 'days',
            }).returning();
            trialDuration = newDuration;
            console.log(`✅ Created Trial duration`);
        }

        // Check if Trial pricing exists
        const trialPricing = await db.query.coursePricings.findFirst({
            where: and(
                eq(coursePricings.courseId, yogaCourse.id),
                eq(coursePricings.durationId, trialDuration.id)
            )
        });

        if (trialPricing) {
            await db.update(coursePricings)
                .set({
                    originalPrice: '10.00',
                    discountedPrice: '10.00',
                    updatedAt: new Date()
                })
                .where(eq(coursePricings.id, trialPricing.id));
            console.log(`✅ Updated Trial pricing: ₹10`);
        } else {
            await db.insert(coursePricings).values({
                courseId: yogaCourse.id,
                durationId: trialDuration.id,
                originalPrice: '10.00',
                discountedPrice: '10.00',
                currency: 'INR',
                isActive: true,
            });
            console.log(`✅ Created Trial pricing: ₹10`);
        }

        console.log('\n✨ Yoga pricing updated successfully!\n');

    } catch (error) {
        console.error('❌ Error updating pricing:', error);
        process.exit(1);
    }

    process.exit(0);
}

updateYogaTrialPricing();
