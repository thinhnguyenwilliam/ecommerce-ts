// src/repository/product.repo.ts
import { ProductModel } from "../models/product.model";

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
