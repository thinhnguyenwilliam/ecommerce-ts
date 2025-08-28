// src/controllers/access.controller.ts
import { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../core/success.response";
import { AccessService } from "../services/access.service";

class AccessController {
    public async handlerRefreshToken(req: Request, res: Response, next: NextFunction) {
        const result = await AccessService.handleRefreshToken({
            refreshToken: req.refreshToken,
            user: req.user,
            keyStore: req.keyStore
        });

        return new SuccessResponse({
            message: "Get Token successful",
            metadata: result
        }).send(res);
    }

    public async logout(req: Request, res: Response) {
        const result = await AccessService.logout(req.keyStore);

        return new SuccessResponse({
            message: "Logout successful",
            metadata: result
        }).send(res);
    }

    public async login(req: Request, res: Response): Promise<void> {
        const metadata = await AccessService.login(req.body);

        new SuccessResponse({
            message: "Login successful",
            metadata
        }).send(res);
    }
}

export const accessController = new AccessController();
