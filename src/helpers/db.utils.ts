//src/helpers/db.utils.ts
import mongoose from 'mongoose';
import os from 'node:os';
import process from 'node:process';
const _SECONDS = 5000;

export const countConnect = () => {
    const { readyState } = mongoose.connection;

    const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

    console.log(`📡 MongoDB Connection State: ${states[readyState]} (${readyState})`);
};

export const checkOverload = () => {
    setInterval(() => {
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // in MB
        //const maxConnections = numCores * 5;

        const connectionState = mongoose.connection.readyState;

        // Simulated threshold check (replace with real logic if using connection pool tracking)
        if (connectionState !== 1) {
            console.warn(`⚠️ MongoDB not fully connected. State: ${connectionState}`);
        }

        // Note: Mongoose does not expose number of connections directly unless using a pool monitor.
        console.log(`🧠 System Info:`);
        console.log(`🔢 Cores: ${numCores}`);
        console.log(`💾 Memory RSS: ${memoryUsage.toFixed(2)} MB`);
        console.log(`🌐 MongoDB ReadyState: ${connectionState}`);
    }, _SECONDS);
};
