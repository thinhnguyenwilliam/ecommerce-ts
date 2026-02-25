// ecommerce-ts/src/tests/rabbitmq.int.test.ts
// npx jest
// npx jest src/tests/rabbitmq.int.test.ts
import { connectToRabbitMQ } from "../dbs/init.rabbitmq";
import { Channel } from "amqplib";

describe("RabbitMQ Integration Test", () => {
  let channel: Channel;

  beforeAll(async () => {
    channel = await connectToRabbitMQ();
  });

  afterAll(async () => {
    await channel.close();
  });

  it("should connect to RabbitMQ and send message", async () => {
    const queue = "jest_test_queue";

    await channel.assertQueue(queue);
    const ok = channel.sendToQueue(queue, Buffer.from("hello"));

    expect(ok).toBe(true);
  });
});