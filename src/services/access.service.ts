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
    static async handleRefreshToken(refreshToken: string) {
        // 1. Check if refresh token has been used already
        const foundRefreshToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);

        if (foundRefreshToken) {
            // Decode who tried to reuse
            const { userId, email } = verifyJWT(refreshToken, foundRefreshToken.privateKey) as {
                userId: Types.ObjectId,
                email: string
            };
            console.log("Reused refresh token by:", userId, email);

            // Remove all keys for that user
            await keyTokenService.deleteKeyById(userId);

            throw new ForbiddenError("Something went wrong! Please login again.");
        }

        // 2. If not used, check if it's valid
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) throw new AuthFailureError("Shop not registered");

        // Verify token with private key
        const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey) as {
            userId: string,
            email: string
        };
        console.log("[2] -- valid refresh token:", userId, email);

        // Check shop exists
        const foundShop = await shopService.findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered");

        // 3. Create new token pair
        const tokens = await createTokenPair(
            { userId: foundShop._id as Types.ObjectId, email },
            holderToken.publicKey,
            holderToken.privateKey
        );

        // 4. Update token store
        await holderToken.updateOne({
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
