// ecommerce-ts/src/tests/message_queue/rabbitmq/producerDLX.ts
// npx ts-node src/tests/message_queue/rabbitmq/producerDLX.ts
import amqp from "amqplib";

const message = {
  anime: "bleach",
  createdAt: new Date().toISOString(),
};

async function runProducer() {
  try {
    const connection = await amqp.connect(
      "amqp://admin:admin123@localhost:5672"
    );
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEX";
    const notiQueue = "notificationQueueProcess";
    const notificationExchangeDLX = "notificationExDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // Create main exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // Create DLX exchange
    await channel.assertExchange(notificationExchangeDLX, "direct", {
      durable: true,
    });

    // Create queue with Dead Letter config
    const queueResult = await channel.assertQueue(notiQueue, {
      durable: true,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // Bind queue to exchange
    await channel.bindQueue(
      queueResult.queue,
      notificationExchange,
      ""
    );

    // Send message (expires after 1 second)
    channel.sendToQueue(
      queueResult.queue,
      Buffer.from(JSON.stringify(message)),
      {
        expiration: "1000", // must be STRING
        persistent: true,
      }
    );

    console.log("Message sent");

    // Close safely
    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.error("Producer error:", error);
  }
}

runProducer();