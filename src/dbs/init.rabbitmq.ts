// ecommerce-ts/src/dbs/init.rabbitmq.ts
import amqp, { Channel, ChannelModel } from "amqplib";
import config from "../config/environment";

const RABBITMQ_URL = config.rabbitmq.url;

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const connectToRabbitMQ = async (): Promise<Channel> => {
  try {
    if (channel) {
      return channel;
    }

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
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    throw error;
  }
};

export const getRabbitMQChannel = (): Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

export const connectToRabbitMQTest = async (): Promise<void> => {
  try {
    console.log("RabbitMQ URL:", RABBITMQ_URL);

    connection = await amqp.connect(RABBITMQ_URL);
    console.log("✅ Connected to RabbitMQ");

    channel = await connection.createChannel();
    console.log("✅ Channel created");

    const queue = "test_queue";

    await channel.assertQueue(queue);
    console.log(`✅ Queue asserted: ${queue}`);

    channel.sendToQueue(queue, Buffer.from("Hello RabbitMQ"));
    console.log("📨 Message sent");

    await channel.close();
    await connection.close();

    console.log("🔌 Connection closed");
  } catch (error) {
    console.error("❌ RabbitMQ test failed:", error);
  }
};