import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedCategories() {
    try {
        console.log('Seeding categories...\n');

        const categoriesToAdd = [
            {
                name: 'Finance',
                slug: 'finance',
                description: 'Master financial markets with comprehensive courses on trading, investment strategies, and risk management.',
                icon: '📈',
                imageUrl: null, // You can upload images later
            },
            {
                name: 'Fitness',
                slug: 'fitness',
                description: 'Transform your body and mind with our fitness programs including yoga, strength training, and wellness.',
                icon: '💪',
                imageUrl: null,
            },
        ];

        for (const category of categoriesToAdd) {
            // Check if category already exists
            const existing = await db.query.categories.findFirst({
                where: eq(categories.slug, category.slug),
            });

            if (existing) {
                console.log(`✓ Category "${category.name}" already exists`);
            } else {
                await db.insert(categories).values(category);
                console.log(`✅ Added category "${category.name}"`);
            }
        }

        console.log('\n✅ Categories seeded successfully!');

    } catch (error) {
        console.error('Error seeding categories:', error);
    } finally {
        process.exit(0);
    }
}

seedCategories();
