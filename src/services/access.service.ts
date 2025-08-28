// src/services/access.service.ts
import { AuthFailureError, BadRequestError, ForbiddenError } from "../core/error.response";
import { shopService } from "./shop.service";
import bcrypt from "bcrypt";
import { generateKeyPair } from "../utils/keyGenerator";
import { createTokenPair, verifyJWT } from "../auth/authUtils";
import { getInfoData } from "../utils";
import { Types } from 'mongoose';
import { keyTokenService } from "./keyToken.service";

interface LoginParams {
    email: string;
    password: string;
    refreshToken?: string | null;
}

class AccessService {
    static async handleRefreshToken({
        refreshToken,
        user,
        keyStore
    }: {
        refreshToken: string;
        user: { userId: string; email: string };
        keyStore: any;
    }) {
        const { userId, email } = user; // ✅ now we can use them

        // 1. Check if refresh token was already used
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyByUserId(userId);
            throw new ForbiddenError("Something went wrong! Please login again.");
        }

        // 2. Check if refreshToken matches current one in DB
        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("Shop not registered");
        }

        // 3. Ensure shop exists
        const foundShop = await shopService.findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered");

        // 4. Create new token pair
        const tokens = await createTokenPair(
            { userId: foundShop._id as Types.ObjectId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        // 5. Update token store
        await keyStore.updateOne({
            $set: { refreshToken: tokens.refreshToken },
            $addToSet: { refreshTokensUsed: refreshToken }
        });

        return {
            user: { userId, email },
            tokens
        };
    }



    public static async logout(keyStore: any) {
        if (!keyStore?._id) {
            throw new AuthFailureError("Invalid keyStore");
        }

        const deleted = await keyTokenService.removeKeyById(keyStore._id);
        return deleted;
    }
    /*
        1 - Check email in DB
        2 - Match password
        3 - Create AT and RT keys
        4 - Generate tokens
        5 - Return shop info + tokens
    */
    static async login({ email, password, refreshToken = null }: LoginParams) {
        // 1. Check email
        const foundShop = await shopService.findByEmail({ email });
        if (!foundShop) throw new BadRequestError("Shop not registered");

        // 2. Match password
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication Error");

        // 3. Generate keys
        const { privateKey, publicKey } = generateKeyPair();

        // 4. Generate token pair
        const tokens = await createTokenPair(
            { userId: foundShop._id as Types.ObjectId, email },
            publicKey,
            privateKey
        );

        //console.log("🔐 Token pair created:", tokens);

        await keyTokenService.createKeyToken(
            foundShop._id as Types.ObjectId,
            publicKey,
            privateKey,
            tokens.refreshToken
        );


        // 5. Return shop info + tokens
        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop
            }),
            tokens
        };
    }
}

export { AccessService };
