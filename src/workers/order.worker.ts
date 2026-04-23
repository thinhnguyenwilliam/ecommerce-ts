// src/workers/order.worker.ts
import RabbitMQService from "../services/rabbitmq.service";
import OrderService from "../services/order.service";

const startWorker = async () => {
  const channel = await RabbitMQService.getChannel();

  channel.consume("order-queue", async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    try {
      console.log("Processing order:", data.idempotencyKey);

      // 🔥 idempotency check
      const existed = await OrderService.checkExistByKey(data.idempotencyKey);
      if (existed) {
        channel.ack(msg);
        return;
      }

      // 🔥 xử lý order
      await OrderService.createOrder({
        userId: data.userId,
        checkoutData: data.checkoutData,
      });

      channel.ack(msg);
    } catch (err) {
      console.error("Order failed:", err);

      // ❗ retry hoặc đưa vào DLQ
      channel.nack(msg, false, false); // false = send to DLQ
    }
  });
};

startWorker();