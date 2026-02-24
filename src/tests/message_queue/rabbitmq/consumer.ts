// ecommerce-ts/src/tests/message_queue/rabbitmq/consumer.ts
import amqp from "amqplib";

const QUEUE = "order-created";

async function run() {
  const connection = await amqp.connect("amqp://admin:admin123@localhost:5672");
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });
  channel.prefetch(1);

  console.log("👂 Waiting for messages...");

  channel.consume(QUEUE, (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    console.log("📨 Message received:", content);

    // simulate work
    setTimeout(() => {
      channel.ack(msg);
      console.log("✅ Message acknowledged");
    }, 500);
  });
}

run().catch(console.error);