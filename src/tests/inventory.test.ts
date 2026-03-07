// ecommerce-ts/src/tests/inventory.test.ts

import redisPubSubService from "../services/redisPubSub.service";

class InventoryServiceTest {

    async init() {
        await redisPubSubService.subscribe("purchase_event", (message: string) => {
            const order = JSON.parse(message);
            InventoryServiceTest.updateInventory(order.productId, order.quantity);
        });

        console.log("📦 Inventory service listening purchase_event");
    }

    static updateInventory(productId: string, quantity: number) {
        console.log(`Update inventory for product ${productId}, quantity: ${quantity}`);
    }
}

export default new InventoryServiceTest();