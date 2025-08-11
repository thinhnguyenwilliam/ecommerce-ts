// src/utils/keyGenerator.ts
import crypto from 'crypto';

export function generateKeyPair() {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    return { privateKey, publicKey };
}
