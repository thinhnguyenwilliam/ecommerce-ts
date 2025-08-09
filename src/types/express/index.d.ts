// src/types/express/index.d.ts
import { ApiKey } from '../../models/api-key.model';

declare global {
    namespace Express {
        interface Request {
            objKey?: {
                permissions?: string[];
                [key: string]: any;
            };
        }
    }
}

export { };
