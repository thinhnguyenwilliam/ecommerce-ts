// src/auth/checkAuth.ts
import { Request, Response, NextFunction } from 'express';
import { createApiKey, findByKey } from '../services/api-key.service';


/**
 * Middleware factory for checking permissions.
 * @param permission Required permission string
 */
export const permission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.objKey?.permissions?.includes(permission)) {
            return res.status(403).json({
                message: 'Permission denied'
            });
        }

        //console.log('Permissions are:', req.objKey.permissions);
        return next();
    };
};


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
};

/**
 * Middleware to check API key validity
 */
export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = req.header(HEADER.API_KEY)?.toString();

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden: API key missing'
            });
        }
        //start just for test to get key to assign in rest.http
        // const newKey = await createApiKey(['0000', '3333']);
        // console.log('Generated API Key:', newKey.key);
        //end just for test

        const objKey = await findByKey(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden: Invalid API key'
            });
        }

        // Attach to request for later use
        (req as any).objKey = objKey;

        return next();
    } catch (error) {
        console.error('API key check error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};