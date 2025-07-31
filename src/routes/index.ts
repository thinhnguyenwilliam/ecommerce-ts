// src/routes/index.ts

import { Router } from 'express';
import shopRouter from './access/shop.route';

const router = Router();

// All routes in shopRouter will be prefixed with /v1/api
router.use('/v1/api', shopRouter);

export default router;

