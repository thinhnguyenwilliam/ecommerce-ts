//src\services\product.classes.ts
import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { ElectronicModel, FurnitureModel, ProductModel } from "../models/product.model";
import * as ProductRepo from "../repository/product.repo";

export class Product {
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



    async publishProductByShop({ product_shop, product_id }: { product_shop: string; product_id: string }) {
        return await ProductRepo.publishProductByShop({ product_shop, product_id });
    }

    async createProduct(product_id?: Types.ObjectId | string) {
        return await ProductModel.create({ ...this, _id: product_id });
    }

    // async findAllisPublishForShop({ limit = 50, skip = 0 }: { limit?: number; skip?: number }) {
    //     const query = { product_shop: this.product_shop, isPublished: true };
    //     return await ProductRepo.publishProductForShop({ query, limit, skip });
    // }

    // 👉 method này gọi xuống repository
    async findAllDraftsForShop({ limit = 50, skip = 0 }: { limit?: number; skip?: number }) {
        const query = { product_shop: this.product_shop, isDraft: true };
        return await ProductRepo.findAllDraftsForShop({ query, limit, skip });
    }
}

export class Electronics extends Product {
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
