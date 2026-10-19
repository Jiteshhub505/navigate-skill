import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function addYogaCategory() {
    try {
        console.log('Adding Yoga category...\n');

        const yogaCategory = {
            name: 'Yoga',
            slug: 'yoga',
            description: 'Find your inner peace and physical strength through our expert-led yoga sessions.',
            icon: '🧘',
            imageUrl: null,
        };

        const existing = await db.query.categories.findFirst({
            where: eq(categories.slug, yogaCategory.slug),
        });

        if (existing) {
            console.log(`✓ Category "Yoga" already exists`);
        } else {
            await db.insert(categories).values(yogaCategory);
            console.log(`✅ Added category "Yoga"`);
        }

    } catch (error) {
        console.error('Error adding Yoga category:', error);
    } finally {
        process.exit(0);
    }
}

addYogaCategory();
