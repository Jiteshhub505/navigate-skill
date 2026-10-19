import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL!);

async function cleanDB() {
    console.log('Cleaning up old tables...');
    try {
        // Drop tables in order of dependencies
        await sql`DROP TABLE IF EXISTS orders CASCADE`;
        await sql`DROP TABLE IF EXISTS courses CASCADE`;
        await sql`DROP TABLE IF EXISTS categories CASCADE`;
        await sql`DROP TABLE IF EXISTS profiles CASCADE`;
        console.log('Database cleaned!');
    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        process.exit();
    }
}

cleanDB();
