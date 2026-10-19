import { db } from '@/lib/db';
import { users, categories, courses, orders, teachers, durations, timings, courseTimings } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

async function clearDatabase() {
    console.log('🗑️  Clearing database...\n');

    try {
        // Drop all tables in correct order (respecting foreign keys)
        console.log('Dropping tables...');
        await db.execute(sql`DROP TABLE IF EXISTS orders CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS course_timings CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS courses CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS timings CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS durations CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS categories CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS teachers CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS profiles CASCADE`);

        console.log('✅ All tables dropped\n');

        // Drop and recreate enums
        console.log('Recreating enums...');
        await db.execute(sql`DROP TYPE IF EXISTS approval_status CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS order_status CASCADE`);
        await db.execute(sql`DROP TYPE IF EXISTS role CASCADE`);

        await db.execute(sql`CREATE TYPE role AS ENUM ('admin', 'teacher', 'student')`);
        await db.execute(sql`CREATE TYPE order_status AS ENUM ('pending', 'completed', 'failed')`);
        await db.execute(sql`CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected')`);

        console.log('✅ Enums recreated\n');

        console.log('✅ Database cleared successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Run: npm run db:push (to create new tables)');
        console.log('2. Run: npx tsx create-admin.ts (to create admin user)');
        console.log('3. Manually insert your course data\n');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    }
}

clearDatabase()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
