// ecommerce-ts/src/routes/upload/upload.route.ts
import { Router } from "express";
import uploadController from "../../controllers/upload.controller";
import { uploadSingle } from "../../middleware/upload.middleware";

const router = Router();

router.post(
  "/upload/image",
  uploadSingle,
  uploadController.uploadImageFromLocalS3
);

export default router;