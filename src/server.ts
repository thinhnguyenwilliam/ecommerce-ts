// src/server.ts
import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 1234;

let server: ReturnType<typeof app.listen>; // Declare in outer scope

// Connect to MongoDB then start server
connectDB().then(() => {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    if (server) {
        server.close(() => {
            console.log('👋 Gracefully shutting down Express server');
            process.exit(0);
        });
    }
});
