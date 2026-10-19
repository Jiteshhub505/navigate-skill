import { db } from '@/lib/db';
import { courses, coursePricings, courseTimings, durations, timings, categories } from '@/lib/db/schema';

async function checkDatabase() {
    try {
        console.log('Checking database...\n');

        // Check categories
        const allCategories = await db.select().from(categories);
        console.log(`Categories found: ${allCategories.length}`);
        console.log(allCategories.map(c => `- ${c.name} (${c.slug})`).join('\n'));
        console.log('');

        // Check durations
        const allDurations = await db.select().from(durations);
        console.log(`Durations found: ${allDurations.length}`);
        console.log(allDurations.map(d => `- ${d.name}`).join('\n'));
        console.log('');

        // Check timings
        const allTimings = await db.select().from(timings);
        console.log(`Timings found: ${allTimings.length}`);
        console.log(allTimings.map(t => `- ${t.name}`).join('\n'));
        console.log('');

        // Check courses
        const allCourses = await db.query.courses.findMany({
            with: {
                category: true,
                coursePricings: {
                    with: {
                        duration: true,
                    },
                },
                courseTimings: {
                    with: {
                        timing: true,
                    },
                },
            },
        });

        console.log(`Courses found: ${allCourses.length}`);
        console.log('');

        allCourses.forEach(course => {
            console.log(`Course: ${course.title}`);
            console.log(`  - Category: ${course.category?.name || 'None'}`);
            console.log(`  - Slug: ${course.slug}`);
            console.log(`  - Pricings: ${course.coursePricings?.length || 0}`);
            if (course.coursePricings && course.coursePricings.length > 0) {
                course.coursePricings.forEach(p => {
                    console.log(`    * ${p.duration?.name}: ₹${p.originalPrice} -> ₹${p.discountedPrice}`);
                });
            }
            console.log(`  - Timings: ${course.courseTimings?.length || 0}`);
            if (course.courseTimings && course.courseTimings.length > 0) {
                course.courseTimings.forEach(t => {
                    console.log(`    * ${t.timing?.name}`);
                });
            }
            console.log('');
        });

        console.log('=== ISSUES FOUND ===');
        const coursesWithoutPricing = allCourses.filter(c => !c.coursePricings || c.coursePricings.length === 0);
        const coursesWithoutTimings = allCourses.filter(c => !c.courseTimings || c.courseTimings.length === 0);

        if (coursesWithoutPricing.length > 0) {
            console.log(`\n❌ ${coursesWithoutPricing.length} courses without pricing:`);
            coursesWithoutPricing.forEach(c => console.log(`  - ${c.title}`));
        }

        if (coursesWithoutTimings.length > 0) {
            console.log(`\n❌ ${coursesWithoutTimings.length} courses without timings:`);
            coursesWithoutTimings.forEach(c => console.log(`  - ${c.title}`));
        }

        if (coursesWithoutPricing.length === 0 && coursesWithoutTimings.length === 0) {
            console.log('\n✅ All courses have pricing and timings configured!');
        }

    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase();
