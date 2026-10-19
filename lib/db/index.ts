import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;

// Singleton client pattern for database connections
const globalForDb = global as unknown as {
    postgresClient?: postgres.Sql;
};

const client = globalForDb.postgresClient || postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

if (process.env.NODE_ENV !== 'production') {
    globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
