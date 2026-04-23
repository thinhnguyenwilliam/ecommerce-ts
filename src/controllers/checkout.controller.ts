// src/controllers/checkout.controller.ts

import { Request, Response } from "express";
import CheckoutService from "../services/checkout.service";
import { SuccessResponse } from "../core/success.response";

class CheckoutController {
    async review(req: Request, res: Response) {
        const result = await CheckoutService.checkoutReview({
            userId: req.user.userId,
            discountCode: req.body.discountCode,
        });

        new SuccessResponse({
            message: "Checkout review success",
            metadata: result,
        }).send(res);
    }
}

export default new CheckoutController();