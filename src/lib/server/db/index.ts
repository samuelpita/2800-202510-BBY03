import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

// Use a default database name if not specified in environment
const MONGODB_DB_NAME = 'treesDB';

let client: MongoClient | undefined;
let db: Db | undefined;

/**
 * Connect to MongoDB and return the client and database
 */
export async function connectToDB() {
    // Reuse the client if already connected
    if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
    }
    
    // Get the database
    if (!db && client) {
        db = client.db(MONGODB_DB_NAME);
    }
    
    return { client, db: db as Db };
}

/**
 * Close the database connection
 */
export async function closeDB(force = false) {
    if (client) {
        await client.close(force);
        client = undefined;
        db = undefined;
    }
}

// Export any shared database helper functions here
export * from './helper';
export * from './types'; 