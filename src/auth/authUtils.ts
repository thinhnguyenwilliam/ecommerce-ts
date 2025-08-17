// src/auth/authUtils.ts
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { asyncHandler } from '../middleware/handle-error';
import { AuthFailureError, NotFoundError } from '../core/error.response';
import { keyTokenService } from '../services/keyToken.service';

export const verifyJWT = (token: string, keySecret: string) => {
    return jwt.verify(token, keySecret);
};

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
};

// Extend Express Request to store keyStore
declare module 'express-serve-static-core' {
    interface Request {
        keyStore?: any;
        user?: any;
    }
}

export const authentication = asyncHandler(async (req, res, next) => {
    // 1. Check if userId is provided
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) throw new AuthFailureError('Invalid Request: Missing userId');

    // 2. Get keyStore from DB
    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not Found: keyStore');

    // 3. Get access token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if (!accessToken) throw new AuthFailureError('Invalid Request: Missing accessToken');

    try {
        // 4. Verify token
        const decodedUser = jwt.verify(accessToken, keyStore.publicKey) as { userId: string };

        if (userId !== decodedUser.userId) {
            throw new AuthFailureError('Invalid userId');
        }

        // 5. Store in request
        req.keyStore = keyStore;
        req.user = decodedUser;

        return next();
    } catch (error) {
        console.log(error);
        throw error;
    }
});

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
    const accessToken = jwt.sign(payload, publicKey, {
        algorithm: 'HS256',
        expiresIn: '2d'
    });

    // 2. Sign refresh token (7 days)
    const refreshToken = jwt.sign(payload, privateKey, {
        algorithm: 'HS256',
        expiresIn: '7d'
    });

    // 3. Verify using the same privateKey (since HS256 is symmetric)
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
