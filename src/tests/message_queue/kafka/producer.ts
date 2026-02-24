// ecommerce-ts/src/tests/message_queue/kafka/producer.ts
import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
  clientId: "ecommerce-test-producer",
  brokers: ["localhost:19092"], // Kafka from Docker
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

async function run() {
  try {
    console.log("🔌 Connecting producer...");
    await producer.connect();

    console.log("📤 Sending message...");
    await producer.send({
      topic: "order-created",
      messages: [
        {
          key: "order-1",
          value: JSON.stringify({
            orderId: "order-1",
            userId: "user-123",
            total: 199.99,
            createdAt: new Date().toISOString(),
          }),
        },
      ],
    });

    console.log("✅ Message sent successfully");
  } catch (error) {
    console.error("❌ Producer error:", error);
  } finally {
    await producer.disconnect();
    console.log("🔌 Producer disconnected");
  }
}

run();