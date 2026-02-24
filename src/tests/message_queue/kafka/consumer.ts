// ecommerce-ts/src/tests/message_queue/kafka/consumer.ts
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "ecommerce-test-consumer",
  brokers: ["localhost:19092"], // Kafka from Docker (host access)
});

const consumer = kafka.consumer({
  groupId: "ecommerce-test-group",
});

async function run() {
  try {
    console.log("🔌 Connecting consumer...");
    await consumer.connect();

    console.log("📥 Subscribing to topic...");
    await consumer.subscribe({
      topic: "order-created",
      fromBeginning: true,
    });

    console.log("👂 Waiting for messages...\n");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log("📨 Message received");
        console.log("  topic:", topic);
        console.log("  partition:", partition);
        console.log("  key:", message.key?.toString());
        console.log("  value:", message.value?.toString());
        console.log("  offset:", message.offset);
        console.log("--------------");
      },
    });
  } catch (error) {
    console.error("❌ Consumer error:", error);
  }
}

run();