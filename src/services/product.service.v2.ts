//src\services\product.service.v2.ts
import { BadRequestError } from "../core/error.response";
import { productRegistry } from "./product.registry";
import { Product } from "./product.classes"; // base Product

class ProductFactory {
    private static readonly productRegistry: Record<string, new (payload: any) => any> = {};

    static registerProductType(type: string, classRef: new (payload: any) => any) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: any) {
        console.log("[1---] [CREATE]", type, Object.keys(ProductFactory.productRegistry));
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }

    // 👉 thêm function cho draft
    static async getAllDraftsForShop({ product_shop, limit = 50, skip = 0 }: any) {
        const product = new Product({ product_shop });
        return product.findAllDraftsForShop({ limit, skip });
    }
}

// --- load registry ---
for (const [type, classRef] of Object.entries(productRegistry)) {
    console.log("[2---] [REGISTER]", type, classRef?.name);
    ProductFactory.registerProductType(type, classRef);
}

export default ProductFactory;
