import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import * as dotenv from 'dotenv'

dotenv.config()

async function updateSchema() {
    console.log('Updating schema manually...')

    try {
        // Add soft delete columns
        await db.execute(sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`)
        await db.execute(sql`ALTER TABLE categories ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`)
        await db.execute(sql`ALTER TABLE teachers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`)
        await db.execute(sql`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`)
        await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`)

        // Create subcategories table
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS subcategories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                category_id UUID NOT NULL REFERENCES categories(id),
                description TEXT,
                deleted_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                updated_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `)

        // Create yoga_leads table
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS yoga_leads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                batch TEXT NOT NULL,
                slot TEXT NOT NULL,
                requirement TEXT,
                submitted_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `)

        // Add subcategory_id to courses
        await db.execute(sql`ALTER TABLE courses ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id)`)

        // Add duration_id to orders for expiration tracking
        await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS duration_id UUID REFERENCES durations(id)`)

        console.log('Schema update complete!')
    } catch (error) {
        console.error('Schema update failed:', error)
    } finally {
        process.exit()
    }
}

updateSchema()
