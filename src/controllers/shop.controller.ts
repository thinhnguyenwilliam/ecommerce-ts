// src/controllers/shop.controller.ts
import { Request, Response } from 'express';
import { shopService } from '../services/shop.service';
import { CREATED } from '../core/success.response';

class ShopController {
    public async signUp(req: Request, res: Response): Promise<void> {
        const t = req.t; // Extract the translator function from request
        const { name, email, password, phone, address } = req.body;

        // TODO: validate input, hash password, check for duplicates, save to DB
        //console.log('📥 Shop sign-up request:', req.body);

        const result = await shopService.createShop({ name, email, password, phone, address }, t);

        new CREATED({
            message: 'Shop successfully created',
            metadata: result,
            options: { limit: 10, pagination: true }
        }).send(res);
    }

    // public async login(...) {}
    //   public async updateShop(...) {}
    //   public async getShops(...) {}

}

// Export a single instance (singleton)
export const shopController = new ShopController();