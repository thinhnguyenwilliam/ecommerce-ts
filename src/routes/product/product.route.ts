// src/routes/product/product.route.ts
import { Router } from "express";
import { asyncHandler } from "../../middleware/handle-error";
import { authenticationV2 } from "../../auth/authUtils";
import ProductController from "../../controllers/product.controller";

const router = Router();

// api tìm kiếm product thì viết trên  dòng router.use(authenticationV2); vì user bình thường mà

// Apply authentication middleware
router.use(authenticationV2);

// Create product route
router.post(
  "/",
  asyncHandler((req, res) => new ProductController().createProduct(req, res))
);

router.get(
  "/drafts/all",
  asyncHandler((req, res) => new ProductController().getAllDraftsForShop(req, res))
);

router.patch(
  "/:id/publish",
  asyncHandler((req, res) =>
    new ProductController().publishProductByShop(req, res)
  )
);

export default router;
