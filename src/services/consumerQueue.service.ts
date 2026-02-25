// ecommerce-ts/src/services/consumerQueue.service.ts
// npx ts-node src/services/consumerQueue.service.ts
import { messageService } from "./message.service";
import { consumeQueue } from "../dbs/init.rabbitmq";

const QUEUE_NAME = "test_queue_2";

export const startMessageConsumer = async (): Promise<void> => {
  await consumeQueue(QUEUE_NAME, async (message: string) => {
    console.log("📨 Message received in service:", message);

    // TODO: xử lý business logic ở đây
    // ví dụ:
    await messageService.handle(message);
  });
};