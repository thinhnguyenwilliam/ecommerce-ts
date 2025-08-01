// src/service/keyToken.service.ts
import { Key } from '../models/key-token.model';
import { Types } from 'mongoose';

class KeyTokenService {
    public async createKeyToken(userId: Types.ObjectId, publicKey: string) {
        //findOneAndUpdate--> if it exists, update it; if not, create a new one.
        const tokenDoc = await Key.findOneAndUpdate(
            { user: userId },
            { publicKey, refreshTokens: [] },
            { upsert: true, new: true }
        );
        return tokenDoc;
    }

    public async findByUserId(userId: Types.ObjectId) {
        return Key.findOne({ user: userId });
    }

    public async addRefreshToken(userId: Types.ObjectId, refreshToken: string) {
        return Key.findOneAndUpdate(
            { user: userId },
            { $addToSet: { refreshTokens: refreshToken } }, // avoids duplicates
            { new: true }
        );
    }

    public async removeRefreshToken(userId: Types.ObjectId, refreshToken: string) {
        return Key.findOneAndUpdate(
            { user: userId },
            { $pull: { refreshTokens: refreshToken } }
        );
    }
}

export const keyTokenService = new KeyTokenService();
