// src/repository/product.repo.ts
import { ProductModel } from "../models/product.model";



export const publishProductByShop = async ({
    product_shop,
    product_id,
}: {
    product_shop: string;
    product_id: string;
}) => {
    return await ProductModel.findOneAndUpdate(
        {
            _id: product_id,
            product_shop,
        },
        {
            isDraft: false,
            isPublished: true,
        },
        { new: true }
    );
};

interface FindAllDraftsParams {
    query: Record<string, any>;
    limit: number;
    skip: number;
}

export const findAllProductsForShop = async ({
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
