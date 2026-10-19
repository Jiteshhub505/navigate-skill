import { db } from '../lib/db';
import { courses, coursePricings, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function updateYoga20RsTrial() {
    console.log('🔧 Updating Yoga trial pricing to ₹20 in the database...\n');

    try {
        // Find Yoga course
        const yogaCourse = await db.query.courses.findFirst({
            where: eq(courses.slug, 'yoga'),
            with: {
                coursePricings: {
                    with: {
                        duration: true
                    }
                }
            }
        });

        if (!yogaCourse) {
            console.error('❌ Yoga course not found');
            process.exit(1);
        }

        console.log(`✅ Found Yoga course: ${yogaCourse.id}`);

        // Find or create Trial duration
        let trialDuration = await db.query.durations.findFirst({
            where: eq(durations.name, 'Trial')
        });

        if (!trialDuration) {
            console.log('Creating Trial duration...');
            const [newDur] = await db.insert(durations).values({
                name: 'Trial',
                value: 1,
                unit: 'days'
            }).returning();
            trialDuration = newDur;
        }

        // Find trial pricing for yoga
        const trialPricing = await db.query.coursePricings.findFirst({
            where: and(
                eq(coursePricings.courseId, yogaCourse.id),
                eq(coursePricings.durationId, trialDuration.id)
            )
        });

        if (trialPricing) {
            await db.update(coursePricings)
                .set({
                    originalPrice: '50.00',
                    discountedPrice: '20.00',
                    isActive: true,
                    updatedAt: new Date()
                })
                .where(eq(coursePricings.id, trialPricing.id));
            console.log(`✅ Updated existing Yoga trial pricing to ₹20 (Original: ₹50)`);
        } else {
            await db.insert(coursePricings).values({
                courseId: yogaCourse.id,
                durationId: trialDuration.id,
                originalPrice: '50.00',
                discountedPrice: '20.00',
                currency: 'INR',
                isActive: true
            });
            console.log(`✅ Inserted Yoga trial pricing of ₹20`);
        }

        console.log('\n✨ Database successfully updated with ₹20 Yoga Trial pricing!');
    } catch (err) {
        console.error('❌ Error updating pricing:', err);
        process.exit(1);
    }

    process.exit(0);
}

updateYoga20RsTrial();
