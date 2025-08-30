// src/services/product.service.ts
import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { ClothingModel, ElectronicModel, ProductModel } from "../models/product.model";

// ------------------------
// Factory class
// ------------------------
class ProductFactory {
    static async createProduct(type: string, payload: any) {
        switch (type) {
            case "Electronics":
                return new Electronic(payload).createProduct();
            case "Clothing":
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid Product Type ${type}`);
        }
    }
}

// ------------------------
// Base Product class
// ------------------------
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

    async createProduct(product_id: Types.ObjectId | string) {
        return await ProductModel.create({ ...this, _id: product_id });
    }
}

// ------------------------
// Clothing subclass
// ------------------------
class Clothing extends Product {
    async createProduct() {
        const newClothing = await ClothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        }
        );
        if (!newClothing) throw new BadRequestError("Create new Clothing Error");

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError("Create new Product Error");

        return newProduct;
    }
}

// ------------------------
// Electronic subclass
// ------------------------
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await ElectronicModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        }
        );
        if (!newElectronic) throw new BadRequestError("Create new Electronic Error");

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError("Create new Product Error");

        return newProduct;
    }
}

// ------------------------
// Export factory
// ------------------------
export default ProductFactory;
