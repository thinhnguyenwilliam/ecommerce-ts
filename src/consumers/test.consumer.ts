// src/consumers/test.consumer.ts
// npx ts-node src/consumers/test.consumer.ts
import { consumeQueue } from "../dbs/init.rabbitmq";

consumeQueue("test_queue_1", async (message) => {
  console.log("🔥 Processing:", message);
});