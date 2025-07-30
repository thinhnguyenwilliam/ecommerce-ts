// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load env variables

const {
    DEV_DB_HOST = '127.0.0.1',
    DEV_DB_PORT = '27017',
    DEV_DB_NAME = 'shopDEV'
} = process.env;

const MONGO_URI = `mongodb://${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ Connected to MongoDB at ${MONGO_URI}`);
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
