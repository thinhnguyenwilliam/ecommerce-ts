// src/routes/product/product.route.ts
import { Router } from "express";
import { asyncHandler } from "../../middleware/handle-error";
import { authentication } from "../../auth/authUtils";
import ProductController from "../../controllers/product.controller";

const router = Router();

// Apply authentication middleware
router.use(authentication);

// Create product route
router.post(
  "/",
  asyncHandler((req, res) => new ProductController().createProduct(req, res))
);

router.get(
  "/drafts/all",
  asyncHandler((req, res) => new ProductController().getAllDraftsForShop(req, res))
);
export default router;
