// src/service/keyToken.service.ts
import { Key } from '../models/key-token.model';
import { Types } from 'mongoose';

class KeyTokenService {
    public async removeKeyById(id: Types.ObjectId) {
        return await Key.deleteOne({ _id: id });
    }

    public async findByUserId(userId: string | Types.ObjectId) {
        const objectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
        return await Key.findOne({ user: objectId }).lean();
    }

    /**
     * Creates or updates a key token document for a user.
     * @param userId MongoDB ObjectId for the user
     * @param publicKey Public key string
     * @param privateKey Private key string
     * @param refreshToken Current refresh token
     */
    public async createKeyToken(
        userId: Types.ObjectId,
        publicKey: string,
        privateKey: string,
        refreshToken: string
    ) {
        const filter = { user: userId };

        const update = {
            publicKey,
            privateKey,
            refreshTokensUsed: [],
            refreshToken
        };

        const options = { upsert: true, new: true };

        const tokenDoc = await Key.findOneAndUpdate(filter, update, options);
        return tokenDoc;
    }
}

export const keyTokenService = new KeyTokenService();

