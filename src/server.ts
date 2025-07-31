// src/server.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//import { checkOverload } from './helpers/db.utils';

import app from './app';
import Database from './config/db';

const PORT = process.env.PORT || 1234;

let server: ReturnType<typeof app.listen>;

Database.init().then(() => {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`🌍 Running in ${process.env.NODE_ENV || 'dev'} mode`);
    });
}).catch((err) => {
    console.error('❌ Server startup failed:', err);
    process.exit(1);// Exit with failure
});

//checkOverload(); // Start system monitoring

// Graceful shutdown
process.on('SIGINT', async () => {
    if (server) {
        server.close(async () => {
            await mongoose.connection.close();
            console.log('🛑 MongoDB disconnected');
            process.exit(0);// Exit cleanly
        });
    }
});
