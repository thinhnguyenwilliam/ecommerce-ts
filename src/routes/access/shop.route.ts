// src/routes/access/shop.route.ts
import { Router } from 'express';
import { shopController } from '../../controllers/shop.controller';
import { asyncHandler } from '../../middleware/handle-error';
import { accessController } from "../../controllers/access.controller";

const router = Router();

// Shop sign-up
router.post(
    '/shop/sign-up',
    asyncHandler(shopController.signUp.bind(shopController))
);

// Shop login
router.post(
    "/login",
    asyncHandler(accessController.login.bind(accessController))
);

export default router;
