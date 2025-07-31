// src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config();


interface AppConfig {
    app: {
        port: number;
    };
    db: {
        host: string;
        port: number;
        name: string;
    };
}

const dev: AppConfig = {
    app: {
        port: Number(process.env.PORT) || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: Number(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'dbDEV'
    }
};

const prod: AppConfig = {
    app: {
        port: 3000
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'dbPROD'
    }
};

const config: Record<string, AppConfig> = { dev, prod };

// Get env (default to "dev" if not set)
const env = process.env.NODE_ENV || 'dev';

// Export the config for the current environment
export default config[env];
