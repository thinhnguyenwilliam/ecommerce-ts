// src/routes/index.ts
import { Router } from 'express';
import shopRouter from './access/shop.route';
import productRouter from "./product/product.route";
import { apiKey, permission } from '../auth/checkAuth';


const router = Router();

// 1️⃣ First, check API Key for all routes under /v1/api
router.use(apiKey);

// 2️⃣ Optionally, check permission if you want role-based control
//    You can pass required permissions to the middleware
router.use(permission('0000'));

// 3️⃣ Mount the actual feature routes
router.use('/v1/api/product', productRouter);
router.use('/v1/api', shopRouter);

export default router;
