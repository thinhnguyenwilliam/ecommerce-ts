// ecommerce-ts/src/tests/product.test.ts

import redisPubSubService from "../services/redisPubSub.service";

class ProductServiceTest {

    async purchaseProduct(productId: string, quantity: number): Promise<void> {
        const order = {
            productId,
            quantity
        };

        await redisPubSubService.publish(
            "purchase_event",
            JSON.stringify(order)
        );
        
        console.log("🛒 Product purchased event published");
    }

}

export default new ProductServiceTest();