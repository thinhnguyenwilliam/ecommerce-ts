// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import ProductFactory from "../services/product.service.v2";

class ProductController {
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
