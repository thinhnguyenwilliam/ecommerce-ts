// ecommerce-ts/src/services/consumerQueue.service.ts
// npx ts-node src/services/consumerQueue.service.ts

import { consumeQueue } from "../dbs/init.rabbitmq";
import { messageService } from "./message.service";

/**
 * Consume NORMAL queue (business logic)
 * If error is thrown -> nack(requeue=false) -> DLX
 */
export const consumeToQueueNormal = async (
  queueName: string
): Promise<void> => {
  await consumeQueue(queueName, async (message: string) => {
    console.log("📨 NORMAL queue message:", message);

    // 🔥 Business logic
    // Throw error -> message goes to DLX
    await messageService.handle(message);
  });
};

/**
 * Consume FAILED / DLX queue
 */
export const consumeToQueueFailed = async (
  queueName: string
): Promise<void> => {
  await consumeQueue(queueName, async (message: string) => {
    console.error("🔥 DLX queue message:", message);

    // TODO:
    // - save to DB
    // - send alert
    // - manual retry
  });
};

/**
 * Simple consumer example
 */
const QUEUE_NAME = "test_queue_2";

export const startMessageConsumer = async (): Promise<void> => {
  await consumeQueue(QUEUE_NAME, async (message: string) => {
    console.log("📨 Message received:", message);
    await messageService.handle(message);
  });
};