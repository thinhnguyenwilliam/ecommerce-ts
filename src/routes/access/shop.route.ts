// src/routes/access/shop.route.ts
import { Router } from 'express';
import { shopController } from '../../controllers/shop.controller';

const router = Router();

router.post('/shop/sign-up', shopController.signUp.bind(shopController));

export default router;