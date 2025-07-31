// src/controllers/shop.controller.ts
import { Request, Response } from 'express';
import { shopService } from '../services/shop.service';

class ShopController {
    public async signUp(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, phone, address } = req.body;

            // TODO: validate input, hash password, check for duplicates, save to DB
            console.log('📥 Shop sign-up request:', req.body);

            const newShop = await shopService.createShop({ name, email, password, phone, address });

            // Simulated response
            res.status(201).json({
                metadata: newShop
            });
        } catch (error) {
            console.error('❌ Shop sign-up failed:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // public async login(...) {}
    //   public async updateShop(...) {}
    //   public async getShops(...) {}

}

// Export a single instance (singleton)
export const shopController = new ShopController();