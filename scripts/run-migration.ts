import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { prepare: false });

async function migrate() {
    console.log('Starting migration...');

    try {
        // Read the schema update file
        const schemaUpdatePath = path.join(process.cwd(), 'db', 'schema_update.sql');
        const schemaUpdateSql = fs.readFileSync(schemaUpdatePath, 'utf8');

        console.log('Executing schema update...');
        await sql.unsafe(schemaUpdateSql);
        console.log('Schema update successful!');

        // Update the Supabase trigger to sync with 'users' table instead of 'profiles'
        console.log('Updating Supabase trigger...');
        const triggerSql = `
            -- Drop old trigger and function if they exist
            DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
            DROP FUNCTION IF EXISTS public.handle_new_user();

            -- Create new function to handle user sync
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO public.users (id, email, name, role, approval_status)
                VALUES (
                    new.id, 
                    new.email, 
                    COALESCE(new.raw_user_meta_data->>'full_name', 'User'), 
                    'student', 
                    'approved'
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;

            -- Create trigger
            CREATE TRIGGER on_auth_user_created
                AFTER INSERT ON auth.users
                FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
        `;

        await sql.unsafe(triggerSql);
        console.log('Trigger update successful!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sql.end();
    }
}

migrate();
