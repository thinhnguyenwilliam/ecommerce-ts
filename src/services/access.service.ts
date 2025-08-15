// src/services/access.service.ts
import { AuthFailureError, BadRequestError } from "../core/error.response";
import { shopService } from "./shop.service";
import bcrypt from "bcrypt";
import { generateKeyPair } from "../utils/keyGenerator";
import { createTokenPair } from "../auth/authUtils";
import { getInfoData } from "../utils";
import { Types } from 'mongoose';
import { keyTokenService } from "./keyToken.service";

interface LoginParams {
    email: string;
    password: string;
    refreshToken?: string | null;
}

class AccessService {
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
