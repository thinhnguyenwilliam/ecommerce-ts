// src/controllers/access.controller.ts
import { Request, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { AccessService } from "../services/access.service";

class AccessController {
    public async login(req: Request, res: Response): Promise<void> {
        const metadata = await AccessService.login(req.body);

        new SuccessResponse({
            message: "Login successful",
            metadata
        }).send(res);
    }
}

export const accessController = new AccessController();
