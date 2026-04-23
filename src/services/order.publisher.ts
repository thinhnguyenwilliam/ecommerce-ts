// src/services/order.publisher.ts
import RabbitMQService from "./rabbitmq.service";

class OrderPublisher {
  static async publishCreateOrder(payload: any) {
    const channel = await RabbitMQService.getChannel();

    channel.publish(
      "order-exchange",
      "order.create",
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true, // survive restart
        messageId: payload.idempotencyKey, // 🔥 idempotency
      }
    );
  }
}

export default OrderPublisher;