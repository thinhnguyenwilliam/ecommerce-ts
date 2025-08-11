// src/services/shop.service.ts
import { Shop } from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { keyTokenService } from './keyToken.service';
import { Types } from 'mongoose';
import { createTokenPair } from '../auth/authUtils';
import { getInfoData } from '../utils';
import { ConflictRequestError } from '../core/error.response';
import { TFunction } from "i18next";

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: '0001',
    EDITOR: '0002',
    ADMIN: 'ADMIN'
};

interface ShopPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}

class ShopService {
    public async findByEmail({
        email,
        select = { email: 1, password: 1, name: 1, status: 1, roles: 1 }
    }: {
        email: string;
        select?: Record<string, number>;
    }) {
        return await Shop.findOne({ email })
            .select(select)
            .lean();
    }
    
    public async createShop(payload: ShopPayload, t: TFunction) {
        // 1. Check if email already exists
        const existingShop = await Shop.findOne({ email: payload.email }).lean();
        if (existingShop) throw new ConflictRequestError(t("shop_created"));

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        // 3. Create new shop with default role
        const newShop = await Shop.create({
            ...payload,
            password: hashedPassword,
            roles: [RoleShop.SHOP],
            verify: false
        });

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        console.log("Private Key is:", privateKey);
        console.log("Public Key is:", publicKey);

        // TODO: Save keys to DB in KeyToken model
        const keyToken = await keyTokenService.createKeyToken(
            newShop._id as Types.ObjectId,
            publicKey,
            privateKey
        );

        console.log('🔐 KeyToken saved to DB:', keyToken);

        const shopPayload = {
            userId: newShop._id as Types.ObjectId,
            email: newShop.email,
            roles: newShop.roles
        };

        const tokens = await createTokenPair(shopPayload, publicKey, privateKey);
        console.log('🔐 Token pair created:', tokens);


        return {
            code: 201,
            metadata: {
                shop: getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: newShop
                }),
                tokens
            }
        };
    }
}

export const shopService = new ShopService();
