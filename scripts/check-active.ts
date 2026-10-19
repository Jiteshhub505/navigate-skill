import { db } from '@/lib/db';
import { courses, coursePricings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkActive() {
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
        console.log('Yoga course not found');
        return;
    }
    console.log('Yoga Pricings:');
    yogaCourse.coursePricings.forEach(p => {
        console.log(`- ID: ${p.id}, Duration: ${p.duration?.name}, Original: ${p.originalPrice}, Discounted: ${p.discountedPrice}, isActive: ${p.isActive}`);
    });
    process.exit(0);
}
checkActive();
