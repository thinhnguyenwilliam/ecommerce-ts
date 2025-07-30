// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { countConnect } from '../helpers/db.utils';

dotenv.config();

const {
    DEV_DB_HOST = '127.0.0.1',
    DEV_DB_PORT = '27017',
    DEV_DB_NAME = 'shopDEV'
} = process.env;

const MONGO_URI = `mongodb://${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`;

class Database {
    private static instance: Database;

    private constructor() {
        // Constructor does nothing async
    }

    private async connect(): Promise<void> {
        try {
            mongoose.set('debug', true);
            await mongoose.connect(MONGO_URI, {
                maxPoolSize: 50, // Limit connection pool
                // Optional: timeout settings
                serverSelectionTimeoutMS: 5000, // Fail fast if server not found
                socketTimeoutMS: 45000,         // Timeout for long-running queries
            });
            console.log('✅ Connected to MongoDB');

            // Optional: use your monitoring function
            countConnect(); // Logs the current connection state
        } catch (err) {
            console.error('❌ MongoDB connection error:', err);
            throw err;
        }
    }

    public static async init(): Promise<Database> {
        if (!Database.instance) {
            const db = new Database();
            await db.connect();
            Database.instance = db;
        }
        return Database.instance;
    }
}

export default Database;
