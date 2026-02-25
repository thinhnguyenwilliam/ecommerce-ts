// src/producers/test.producer.ts
// npx ts-node src/producers/test.producer.ts
import { sendToQueue } from "../dbs/init.rabbitmq";

sendToQueue("test_queue_2", "Hello from producer 2");