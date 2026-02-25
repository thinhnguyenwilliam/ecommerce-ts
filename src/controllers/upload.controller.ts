// ecommerce-ts/src/controllers/upload.controller.ts
import { Request, Response } from "express";
import { uploadToS3 } from "../services/upload.service";
import { SuccessResponse } from "../core/success.response";

class UploadController {
    uploadImageFromLocalS3 = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "File is required",
                });
            }

            const file = req.file;

            // chỉ cho phép image
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    message: "Only images allowed",
                });
            }

            // tạo key S3 (tránh trùng)
            const key = `uploads/${Date.now()}-${file.originalname}`;

            const fileUrl = await uploadToS3(
                file.buffer,
                key,
                file.mimetype
            );

            return new SuccessResponse({
                message: "Upload image successfully",
                metadata: {
                    url: fileUrl,
                    key,
                },
            }).send(res);

        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({
                message: "Upload failed",
            });
        }
    };
}

export default new UploadController();