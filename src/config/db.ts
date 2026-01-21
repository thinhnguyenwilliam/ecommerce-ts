// src/config/db.ts

// singleton pattern: 

import mongoose from 'mongoose';
import { countConnect } from '../helpers/db.utils';


const dbURI = process.env.DEV_MONGO_URI!;

class Database {
    private static instance: Database; //static instance ensures only one instance exists

    private constructor() {
        // Constructor does nothing async
        // private constructor: prevents new Database() from outside
    }

    private async connect(): Promise<void> {
        try {
            mongoose.set('debug', true);
            await mongoose.connect(dbURI, {
                maxPoolSize: 50, // Limit connection pool
                // Optional: timeout settings
                serverSelectionTimeoutMS: 5000, // Fail fast if server not found
                socketTimeoutMS: 45000,         // Timeout for long-running queries
            });
            console.log('🔗 MongoDB connected');

            // Optional: use your monitoring function
            countConnect(); // Logs the current connection state
        } catch (err) {
            console.error('❌ MongoDB connection error:', err);
            throw err;
        }
    }

    private static connecting: Promise<Database> | null = null;

    public static init(): Promise<Database> {
        if (!Database.instance) {
            Database.connecting ??= (async () => {
                const db = new Database();
                await db.connect();
                Database.instance = db;
                return db;
            })();

            return Database.connecting;
        }

        return Promise.resolve(Database.instance);
    }


}

export default Database;
