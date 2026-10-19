// @ts-nocheck
// Script: migrate_pricings.ts
// Purpose: Convert existing `courses.pricing` JSON in the `courses` table
// into normalized rows in `course_pricings`, creating `durations` rows when needed.

import dotenv from 'dotenv';
dotenv.config();

import { db } from '../lib/db';
import { courses, durations, coursePricings } from '../lib/db/schema';

async function run() {
    console.log('Starting pricing migration...');

    // Fetch all courses that have pricing JSON
    const allCourses = await db.select().from(courses).all();
    console.log(`Found ${allCourses.length} courses`);

    for (const c of allCourses) {
        const pricing = c.pricing;
        if (!pricing) continue;

        // pricing expected shape: { oneMonth: { original, discounted }, threeMonths: {...}, ... }
        for (const key of Object.keys(pricing)) {
            const plan = pricing[key];
            if (!plan) continue;

            // Normalize duration label to durations table name
            // e.g. oneMonth -> 1 Month, threeMonths -> 3 Months, sixMonths -> 6 Months, oneYear -> 12 Months
            let durationName = '';
            if (key === 'oneMonth') durationName = '1 Month';
            else if (key === 'threeMonths') durationName = '3 Months';
            else if (key === 'sixMonths') durationName = '6 Months';
            else if (key === 'oneYear') durationName = '12 Months';
            else durationName = key;

            // Ensure duration exists
            let dur = await db.select().from(durations).where(durations.name.eq(durationName)).limit(1).all();
            let durationId;
            if (!dur || dur.length === 0) {
                const insertRes = await db.insert(durations).values({ name: durationName, value: 0, unit: 'months' }).returning();
                durationId = insertRes[0].id;
                console.log(`Created duration ${durationName}`);
            } else {
                durationId = dur[0].id;
            }

            // Insert into course_pricings
            await db.insert(coursePricings).values({
                courseId: c.id,
                durationId,
                originalPrice: plan.original.toString(),
                discountedPrice: plan.discounted.toString(),
                currency: 'INR',
                isActive: true,
            });
            console.log(`Inserted pricing for course ${c.slug} duration ${durationName}`);
        }
    }

    console.log('Pricing migration complete');
    process.exit(0);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
