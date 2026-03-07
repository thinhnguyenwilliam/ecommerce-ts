// src/server.ts
import { startMessageConsumer } from "./services/consumerQueue.service";
import { httpRequestCounter } from "./metrics";
import mongoose from 'mongoose';
import config from "./config/environment";
//import { checkOverload } from './helpers/db.utils';
import app from './app';
import Database from './config/db';
import redisPubSubService from "./services/redisPubSub.service";
import inventoryServiceTest from "./tests/inventory.test";

(async () => {
  await redisPubSubService.connect();
  await inventoryServiceTest.init();
})();

// Consumer chạy nền, không block HTTP server.
(async () => {
  await startMessageConsumer();
})();

const PORT = config.app.port;

let server: ReturnType<typeof app.listen>;

Database.init().then(() => {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Server startup failed:', err);
    process.exit(1);// Exit with failure
});

//checkOverload(); // Start system monitoring

//when dockerfile
// const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/monitoringdb";

// Connect to MongoDB
// mongoose.connect(MONGO_URI)
//     .then(() => console.log("✅ Connected to MongoDB"))
//     .catch(err => console.error("❌ MongoDB connection error:", err));

// Prometheus metrics middleware
// app.use((req, res, next) => {
//     res.on("finish", () => {
//         httpRequestCounter.inc({
//             method: req.method,
//             route: req.route ? req.route.path : req.path,
//             status_code: res.statusCode,
//         });
//     });
//     next();
// });
//

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
