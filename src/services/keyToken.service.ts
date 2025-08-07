// src/service/keyToken.service.ts
import { Key } from '../models/key-token.model';
import { Types } from 'mongoose';

class KeyTokenService {
    public async createKeyToken(userId: Types.ObjectId, publicKey: string, privateKey: string) {
        //findOneAndUpdate--> if it exists, update it; if not, create a new one.
        const tokenDoc = await Key.findOneAndUpdate(
            { user: userId },
            { publicKey, privateKey, refreshTokens: [] },
            { upsert: true, new: true }
        );
        return tokenDoc;
    }

}

export const keyTokenService = new KeyTokenService();
