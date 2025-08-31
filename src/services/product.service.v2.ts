// src/services/product.service.v2.ts
import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { ElectronicModel, ProductModel, FurnitureModel } from "../models/product.model";
import { productConfig } from "./product.config";

class ProductFactory {
    private static readonly productRegistry: Record<string, new (payload: any) => Product> = {};

    static registerProductType(type: string, classRef: new (payload: any) => Product) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: any) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }
}

class Product {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop: string;
    product_attributes: Record<string, any>;

    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }: any) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id?: Types.ObjectId | string) {
        return await ProductModel.create({ ...this, _id: product_id });
    }
}

export class Electronic extends Product {
    async createProduct() {
        const newElectronic = await ElectronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) throw new BadRequestError("Create new Electronic Error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new Product Error");

        return newProduct;
    }
}

export class Furniture extends Product {
    async createProduct() {
        const newFurniture = await FurnitureModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) throw new BadRequestError("Create new Furniture Error");

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError("Create new Product Error");

        return newProduct;
    }
}

// --- load config ---
Object.entries(productConfig).forEach(([type, classRef]) => {
    ProductFactory.registerProductType(type, classRef);
});

export default ProductFactory;
