// ecommerce-ts/src/middleware/upload.middleware.ts
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("file");