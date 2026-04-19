// src/controllers/product.controller.ts
import { Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import ProductFactory from "../services/product.service.v2";
import { NotFoundError } from "../core/error.response";

class ProductController {
    public async publishProductByShop(req: Request, res: Response): Promise<void> {
        const result = await ProductFactory.publishProductByShop({
            product_shop: req.user.userId,
            product_id: req.params.id,
        });

        if (!result) {
            throw new NotFoundError("Product not found or not belong to shop");
        }

        new SuccessResponse({
            message: "Publish product successfully",
            metadata: result,
        }).send(res);
    }

    public async getAllDraftsForShop(req: Request, res: Response): Promise<void> {
        const drafts = await ProductFactory.getAllDraftsForShop({
            product_shop: req.user.userId,
            limit: Number(req.query.limit) || 50,
            skip: Number(req.query.skip) || 0,
        });

        new SuccessResponse({
            message: "Get List Drafts successfully",
            metadata: drafts,
        }).send(res);
    }

    public async createProduct(req: Request, res: Response): Promise<void> {
        const product = await ProductFactory.createProduct(
            req.body.product_type,
            {
                ...req.body,
                product_shop: req.user.userId
            }
        );

        new SuccessResponse({
            message: "Product successfully created",
            metadata: product,
        }).send(res);
    }
}

export default ProductController;
