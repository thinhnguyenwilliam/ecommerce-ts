// src/services/rabbitmq.service.ts
import * as amqp from "amqplib";

class RabbitMQService {
  private static conn: any;
  private static channel: amqp.Channel;

  static async getChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      this.conn = await amqp.connect("amqp://admin:admin123@localhost:5672");
      this.channel = await this.conn.createChannel();

      // durability
      await this.channel.assertExchange("order-exchange", "direct", { durable: true });

      await this.channel.assertQueue("order-queue", {
        durable: true,
        deadLetterExchange: "order-dlx",
      });

      await this.channel.assertExchange("order-dlx", "direct", { durable: true });
      await this.channel.assertQueue("order-dlq", { durable: true });

      await this.channel.bindQueue("order-queue", "order-exchange", "order.create");
      await this.channel.bindQueue("order-dlq", "order-dlx", "order.dead");

      // QoS: xử lý tuần tự/giới hạn
      this.channel.prefetch(10);
    }
    return this.channel;
  }
}

export default RabbitMQService;