// src/auth/authUtils.ts
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface TokenPayload {
    userId: Types.ObjectId;
    email?: string;
    roles?: string[];
    [key: string]: any;
}

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export const createTokenPair = async (
    payload: TokenPayload,
    publicKey: string,
    privateKey: string
): Promise<TokenPair> => {
    // 1. Sign access token (2 days)
    const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '2d'
    });

    // 2. Sign refresh token (7 days)
    const refreshToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '7d'
    });

    // 3. Verify access token using publicKey (just to confirm)
    jwt.verify(accessToken, publicKey, (err, decoded) => {
        if (err) {
            console.error('❌ Error verifying token:', err);
        } else {
            console.log('✅ Token verified:', decoded);
        }
    });

    return {
        accessToken,
        refreshToken
    };
};
