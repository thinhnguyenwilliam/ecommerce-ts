// src/routes/access/shop.route.ts
import { Router } from 'express';
import { shopController } from '../../controllers/shop.controller';
import { accessController } from '../../controllers/access.controller';
import { asyncHandler } from '../../middleware/handle-error';
import { authentication } from '../../auth/authUtils';

const router = Router();

// Public routes
router.post(
    '/shop/sign-up',
    asyncHandler(shopController.signUp.bind(shopController))
);

router.post(
    '/login',
    asyncHandler(accessController.login.bind(accessController))
);

// Protected routes
router.use(authentication);

router.post(
    '/logout',
    asyncHandler(accessController.logout.bind(accessController))
);

export default router;
