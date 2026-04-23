// ecommerce-ts/src/services/redis.service.ts

import Redis from "ioredis";

class RedisService {
    private static instance: Redis;

    static getInstance(): Redis {
        if (!RedisService.instance) {
            RedisService.instance = new Redis({
                host: "127.0.0.1",
                port: 6379,
            });
        }
        return RedisService.instance;
    }

    // 🔥 sleep helper
    static sleep(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    // 🔥 acquire lock với retry + backoff
    static async acquireLockWithRetry(
        key: string,
        ttl = 5000,
        retries = 5,
        baseDelay = 50
    ): Promise<string | null> {
        const redis = RedisService.getInstance();

        for (let attempt = 0; attempt < retries; attempt++) {
            const lockValue = Math.random().toString(36).substring(2);

            const result = await redis.set(
                key,
                lockValue,
                "PX",
                ttl,
                "NX"
            );

            if (result === "OK") {
                return lockValue;
            }

            // 🔥 exponential backoff + jitter
            const delay =
                baseDelay * Math.pow(2, attempt) + Math.random() * 50;

            await RedisService.sleep(delay);
        }

        return null;
    }

    // 🔒 basic lock (no retry)
    static async acquireLock(
        key: string,
        ttl = 5000
    ): Promise<string | null> {
        const redis = RedisService.getInstance();

        const lockValue = Math.random().toString(36).substring(2);

        const result = await redis.set(
            key,
            lockValue,
            "PX",
            ttl,
            "NX"
        );

        return result === "OK" ? lockValue : null;
    }

    // 🔓 release lock an toàn
    static async releaseLock(key: string, lockValue: string) {
        const redis = RedisService.getInstance();

        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;

        await redis.eval(script, 1, key, lockValue);
    }
}

export default RedisService;