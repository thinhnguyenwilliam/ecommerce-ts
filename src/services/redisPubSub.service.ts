// ecommerce-ts/src/services/redisPubSub.service.ts

import { createClient, RedisClientType } from "redis";

class RedisPubSubService {
    private readonly pub: RedisClientType;
    private readonly sub: RedisClientType;

    constructor() {
        this.pub = createClient({ url: "redis://localhost:6379" });
        this.sub = createClient({ url: "redis://localhost:6379" });
    }

    async connect(): Promise<void> {
        await this.pub.connect();
        await this.sub.connect();
        console.log("✅ Redis connected");
    }

    async publish(channel: string, message: string): Promise<void> {
        await this.pub.publish(channel, message);
    }

    async subscribe(
        channel: string,
        callback: (message: string) => void
    ): Promise<void> {
        await this.sub.subscribe(channel, (message: string) => {
            callback(message);
        });
    }
}

export default new RedisPubSubService();