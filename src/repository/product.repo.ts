// src/repository/product.repo.ts
import { ProductModel } from "../models/product.model";
import { Types } from "mongoose";

export const publishProductByShop = async ({
    product_shop,
    product_id,
}: {
    product_shop: string;
    product_id: string;
}) => {
    const foundShop = await ProductModel.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    await foundShop.save();

    return foundShop;
};

interface FindAllDraftsParams {
    query: Record<string, any>;
    limit: number;
    skip: number;
}

export const findAllDraftsForShop = async ({
    query,
    limit,
    skip,
}: FindAllDraftsParams) => {
    return await ProductModel.find(query)
        .populate("product_shop", "name email -_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};
