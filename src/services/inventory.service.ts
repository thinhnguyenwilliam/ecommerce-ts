// ecommerce-ts/src/services/inventory.service.ts

import RedisService from "./redis.service";
import * as InventoryRepo from "../repository/inventory.repo";

class InventoryService {
    static async reserveWithLock({
        productId,
        quantity,
        userId,
    }: {
        productId: string;
        quantity: number;
        userId: string;
    }) {
        const lockKey = `lock:product:${productId}`;

        // 1. acquire lock
        // const lockValue = await RedisService.acquireLock(lockKey, 5000);

        const lockValue = await RedisService.acquireLockWithRetry(
            `lock:product:${productId}`
        );

        if (!lockValue) {
            throw new Error("System busy, try again");
        }



        try {
            // 2. call DB (optimistic lock)
            const result = await InventoryRepo.reserveInventory({
                productId,
                quantity,
                userId,
            });

            if (!result) {
                throw new Error("Out of stock");
            }

            return result;
        } finally {
            // 3. release lock
            await RedisService.releaseLock(lockKey, lockValue);
        }
    }
}

export default InventoryService;