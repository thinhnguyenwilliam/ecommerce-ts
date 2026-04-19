// src\services\product.service.v2.ts
import { BadRequestError } from "../core/error.response";
import { productRegistry } from "./product.registry";
import { Product } from "./product.classes";

class ProductFactory {
    private static readonly productRegistry: Record<
        string,
        new (payload: any) => any
    > = {};

    static registerProductType(
        type: string,
        classRef: new (payload: any) => any,
    ) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: any) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass)
            throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }

    static async getAllDraftsForShop({
        product_shop,
        limit = 50,
        skip = 0,
    }: any) {
        const product = new Product({ product_shop });
        return product.findAllDraftsForShop({ limit, skip });
    }

    static async publishProductByShop({ product_shop, product_id }: any) {
        const product = new Product({ product_shop });
        return await product.publishProductByShop({ product_shop, product_id });
    }
}

// --- load registry ---
for (const [type, classRef] of Object.entries(productRegistry)) {
    ProductFactory.registerProductType(type, classRef);
}

export default ProductFactory;
