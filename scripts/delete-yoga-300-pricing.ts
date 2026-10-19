import { db } from '@/lib/db';
import { coursePricings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function diagAndDelete() {
    try {
        const allPricings = await db.select().from(coursePricings);
        console.log('All pricings in database:');
        for (const p of allPricings) {
            console.log(`- ID: ${p.id}, courseId: ${p.courseId}, durationId: ${p.durationId}, original: ${p.originalPrice} (type: ${typeof p.originalPrice}), discounted: ${p.discountedPrice} (type: ${typeof p.discountedPrice}), isActive: ${p.isActive}`);
        }

        const toDelete = allPricings.find(p => Number(p.discountedPrice) === 300);
        if (toDelete) {
            console.log(`\nFound to delete: ${toDelete.id}`);
            const result = await db.delete(coursePricings).where(eq(coursePricings.id, toDelete.id)).returning();
            console.log(`✅ Deleted successfully: ${result[0].id}`);
        } else {
            console.log('\n❌ Could not find any pricing with discounted price = 300');
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

diagAndDelete();
