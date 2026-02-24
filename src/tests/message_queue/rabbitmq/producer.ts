// ecommerce-ts/src/tests/message_queue/rabbitmq/producer.ts
import amqp from "amqplib";

const QUEUE = "order-created";

async function run() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  const message = {
    orderId: "order-1",
    userId: "user-123",
    total: 199.99,
    createdAt: new Date().toISOString(),
  };

  channel.sendToQueue(
    QUEUE,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log("📤 Message sent:", message);

  await channel.close();
  await connection.close();
}

run().catch(console.error);