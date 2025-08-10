// src/controllers/shop.controller.ts
import { Request, Response } from 'express';
import { shopService } from '../services/shop.service';

class ShopController {
    public async signUp(req: Request, res: Response): Promise<void> {
        const t = req.t; // Extract the translator function from request
        const { name, email, password, phone, address } = req.body;

        // TODO: validate input, hash password, check for duplicates, save to DB
        //console.log('📥 Shop sign-up request:', req.body);

        const result = await shopService.createShop({ name, email, password, phone, address }, t);

        // Return response to client
        // res.status(409).json({
        //     code: result.code,
        //     message: req.t("welcome"),
        //     metadata: result.metadata
        // });
        res.status(201).json({
            result
        });
    }

    // public async login(...) {}
    //   public async updateShop(...) {}
    //   public async getShops(...) {}

}

// Export a single instance (singleton)
export const shopController = new ShopController();