// src/routes/access/shop.route.ts
import { Router } from 'express';
import { shopController } from '../../controllers/shop.controller';
import { asyncHandler } from '../../middleware/handle-error';

const router = Router();

router.post(
    '/shop/sign-up',
    asyncHandler(shopController.signUp.bind(shopController))
);

export default router;