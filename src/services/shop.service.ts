// src/services/shop.service.ts
import { Shop } from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { keyTokenService } from './keyToken.service';
import { Types } from 'mongoose';
import { createTokenPair } from '../auth/authUtils';
import { getInfoData } from '../utils';

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
    public async createShop(payload: ShopPayload) {
        // 1. Check if email already exists
        const existingShop = await Shop.findOne({ email: payload.email }).lean();
        if (existingShop) {
            return {
                code: 'SHOP_EXISTS',
                message: 'Shop is already registered!'
            };
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        // 3. Create new shop with default role
        const newShop = await Shop.create({
            ...payload,
            password: hashedPassword,
            roles: [RoleShop.SHOP],
            verify: false
        });

        // 4. Generate RSA key pair (for tokens or secure communication)
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });

        console.log('🔐 Keys generated');
        console.log('Private Key:', privateKey);
        console.log('Public Key:', publicKey);

        // TODO: Save keys to DB in KeyToken model
        const keyToken = await keyTokenService.createKeyToken(
            newShop._id as Types.ObjectId,
            publicKey
        );

        console.log('🔐 KeyToken saved to DB:', keyToken);
        console.log({
            user: keyToken.user.toString(),
            publicKey: keyToken.publicKey.slice(0, 30) + '...',
            id: keyToken._id //That returns the actual Types.ObjectId, usable in DB operations.
        });
        // 3. Convert PEM publicKey back to KeyObject (if needed)
        const keyTokenObject = crypto.createPublicKey(publicKey);
        console.log('🔑 PublicKey KeyObject:', keyTokenObject);

        const shopPayload = {
            userId: newShop._id as Types.ObjectId,
            email: newShop.email,
            roles: newShop.roles
        };

        const tokens = await createTokenPair(shopPayload, publicKey, privateKey);
        console.log('🔐 Token pair created:', tokens);
        console.log('🔐 Token pair created:', {
            accessToken: tokens.accessToken.slice(0, 50) + '...', // optional: slice to shorten output
            refreshToken: tokens.refreshToken.slice(0, 50) + '...'
        });
        console.log('🔐 Access Token:', tokens.accessToken);
        console.log('🔄 Refresh Token:', tokens.refreshToken);

        return {
            code: 201,
            message: 'Shop created successfully!',
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
