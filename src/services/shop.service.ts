// src/services/shop.service.ts
import { Shop } from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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
        // await KeyToken.create({ shopId: newShop._id, publicKey, privateKey });

        return {
            code: 'SHOP_CREATED',
            message: 'Shop created successfully!',
            metadata: {
                shopId: newShop._id
            }
        };
    }
}

export const shopService = new ShopService();
