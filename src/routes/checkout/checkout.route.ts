// ecommerce-ts/src/routes/checkout/checkout.route.ts

import { Router } from "express"
import checkoutController from "../../controllers/checkout.controller";
const router = Router()

// router.post(
//     "/checkout/review",
//     asyncHandler((req:any, res:any) => checkoutController.review(req, res))
// );
export default router