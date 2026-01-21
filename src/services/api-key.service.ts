// src/service/api-key.service.ts
import crypto from 'node:crypto';
import ApiKeyModel from '../models/api-key.model';

/**
 * Create a new API key
 */
export const createApiKey = async (permissions: string[] = ['0000']) => {
    const key = crypto.randomBytes(64).toString('hex');
    return await ApiKeyModel.create({
        key,
        permissions,
        status: true
    });
};

/**
 * Find API Key document by key string
 */
export const findByKey = async (key: string) => {
    return await ApiKeyModel.findOne({
        key,
        status: true
    }).lean();
};
