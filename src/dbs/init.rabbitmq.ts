// ecommerce-ts/src/dbs/init.rabbitmq.ts
import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import config from "../config/environment";

const RABBITMQ_URL = config.rabbitmq.url;

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

/**
 * Connect & get channel (singleton)
 */
export const connectToRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;

  console.log("Connecting to RabbitMQ:", RABBITMQ_URL);

  connection = await amqp.connect(RABBITMQ_URL);

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err);
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed");
    connection = null;
    channel = null;
  });

  channel = await connection.createChannel();

  console.log("RabbitMQ connected successfully");
  return channel;
};

/**
 * Send message
 */
export const sendToQueue = async (
  queue: string,
  message: string
): Promise<void> => {
  const ch = await connectToRabbitMQ();

  await ch.assertQueue(queue, { durable: true });

  ch.sendToQueue(queue, Buffer.from(message), {
    persistent: true,
  });

  console.log(`📨 Sent to ${queue}:`, message);
};

/**
 * Consume message
 */
export const consumeQueue = async (
  queue: string,
  handler: (msg: string) => Promise<void>
): Promise<void> => {
  const ch = await connectToRabbitMQ();

  await ch.assertQueue(queue, { durable: true });

  console.log(`👂 Waiting for messages in ${queue}...`);

  ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const content = msg.content.toString();
      console.log(`📥 Received from ${queue}:`, content);

      await handler(content);

      ch.ack(msg); // ✅ ack when success
    } catch (err) {
      console.error("❌ Consumer error:", err);
      ch.nack(msg, false, false); // ❌ drop message (no retry)
    }
  });
};

/**
 * For test only
 */
export const connectToRabbitMQTest = async (): Promise<void> => {
  try {
    console.log("RabbitMQ URL:", RABBITMQ_URL);

    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();

    const queue = "test_queue";
    await ch.assertQueue(queue);

    ch.sendToQueue(queue, Buffer.from("Hello RabbitMQ"));

    console.log("✅ Test message sent");

    await ch.close();
    await conn.close();
  } catch (error) {
    console.error("❌ RabbitMQ test failed:", error);
  }
};