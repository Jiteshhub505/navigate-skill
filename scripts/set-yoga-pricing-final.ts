import { db } from '@/lib/db';
import { courses, coursePricings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function setYogaPricingFinal() {
    console.log('🔧 Configuring final pricing for Yoga course...');

    try {
        // Find the Yoga course
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
            return;
        }

        console.log(`✅ Found Yoga course: ${yogaCourse.id}`);

        for (const pricing of yogaCourse.coursePricings) {
            const name = pricing.duration?.name;
            const original = Number(pricing.originalPrice);
            const discounted = Number(pricing.discountedPrice);

            let shouldBeActive = false;

            if (name === '1 Month' && original === 999 && discounted === 599) {
                shouldBeActive = true;
            } else if (name === 'Trial' && original === 50 && discounted === 10) {
                shouldBeActive = true;
            } else if (name === '6 Months' && original === 1999 && discounted === 999) {
                shouldBeActive = true;
            }

            console.log(`- Pricing duration: ${name}, original: ${original}, discounted: ${discounted}. Current isActive: ${pricing.isActive} -> Target isActive: ${shouldBeActive}`);

            await db.update(coursePricings)
                .set({
                    isActive: shouldBeActive,
                    updatedAt: new Date()
                })
                .where(eq(coursePricings.id, pricing.id));
        }

        console.log('✨ Yoga pricing configured successfully!');

    } catch (error) {
        console.error('❌ Error setting pricing:', error);
    } finally {
        process.exit(0);
    }
}

setYogaPricingFinal();
