import { db } from '../lib/db';
import { coursePricings, courses, durations } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Updates Yoga course pricing to:
 * - 1 Month: ₹699 (Original ₹999)
 * - 3 Months: ₹1100 (Original ₹1999)
 * - 6 Months: ₹1499 (Original ₹2999)
 */
async function updateYogaNewPricing() {
    console.log('🔧 Updating Yoga course pricing to new values...\n');

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

        // Check or create durations
        let oneMonth = await db.query.durations.findFirst({
            where: eq(durations.name, '1 Month')
        });

        let threeMonths = await db.query.durations.findFirst({
            where: eq(durations.name, '3 Months')
        });

        let sixMonths = await db.query.durations.findFirst({
            where: eq(durations.name, '6 Months')
        });

        if (!oneMonth) {
            const [inserted] = await db.insert(durations).values({ name: '1 Month', value: 1, unit: 'month' }).returning();
            oneMonth = inserted;
        }

        if (!threeMonths) {
            const [inserted] = await db.insert(durations).values({ name: '3 Months', value: 3, unit: 'months' }).returning();
            threeMonths = inserted;
        }

        if (!sixMonths) {
            const [inserted] = await db.insert(durations).values({ name: '6 Months', value: 6, unit: 'months' }).returning();
            sixMonths = inserted;
        }

        // 1. Update 1 Month: ₹699
        if (oneMonth) {
            const p = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, oneMonth.id)
                )
            });

            if (p) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '999.00',
                        discountedPrice: '699.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, p.id));
                console.log(`✅ Updated 1 Month: ₹699`);
            } else {
                await db.insert(coursePricings).values({
                    courseId: yogaCourse.id,
                    durationId: oneMonth.id,
                    originalPrice: '999.00',
                    discountedPrice: '699.00',
                    currency: 'INR',
                    isActive: true,
                });
                console.log(`✅ Created 1 Month pricing: ₹699`);
            }
        }

        // 2. Update 3 Months: ₹1100
        if (threeMonths) {
            const p = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, threeMonths.id)
                )
            });

            if (p) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '1999.00',
                        discountedPrice: '1100.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, p.id));
                console.log(`✅ Updated 3 Months: ₹1100`);
            } else {
                await db.insert(coursePricings).values({
                    courseId: yogaCourse.id,
                    durationId: threeMonths.id,
                    originalPrice: '1999.00',
                    discountedPrice: '1100.00',
                    currency: 'INR',
                    isActive: true,
                });
                console.log(`✅ Created 3 Months pricing: ₹1100`);
            }
        }

        // 3. Update 6 Months: ₹1499
        if (sixMonths) {
            const p = await db.query.coursePricings.findFirst({
                where: and(
                    eq(coursePricings.courseId, yogaCourse.id),
                    eq(coursePricings.durationId, sixMonths.id)
                )
            });

            if (p) {
                await db.update(coursePricings)
                    .set({
                        originalPrice: '2999.00',
                        discountedPrice: '1499.00',
                        isActive: true,
                        updatedAt: new Date()
                    })
                    .where(eq(coursePricings.id, p.id));
                console.log(`✅ Updated 6 Months: ₹1499`);
            } else {
                await db.insert(coursePricings).values({
                    courseId: yogaCourse.id,
                    durationId: sixMonths.id,
                    originalPrice: '2999.00',
                    discountedPrice: '1499.00',
                    currency: 'INR',
                    isActive: true,
                });
                console.log(`✅ Created 6 Months pricing: ₹1499`);
            }
        }

        console.log('\n✨ All Yoga course prices updated successfully in database!\n');

    } catch (error) {
        console.error('❌ Error updating pricing:', error);
        process.exit(1);
    }

    process.exit(0);
}

updateYogaNewPricing();
