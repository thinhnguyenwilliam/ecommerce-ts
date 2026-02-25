// src/config/environment.ts
import "dotenv/config";
export type NodeEnv = "dev" | "prod" | "test";

interface AppConfig {
  app: {
    port: number;
  };
  db: {
    host: string;
    port: number;
    name: string;
  };
  rabbitmq: {
    url: string;
  };
}

const dev: AppConfig = {
  app: {
    port: Number(process.env.PORT) || 1235,
  },
  db: {
    host: process.env.DEV_DB_HOST || "",
    port: Number(process.env.DEV_DB_PORT) || 1234,
    name: process.env.DEV_DB_NAME || "",
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "",
  },
};

const prod: AppConfig = {
  app: {
    port: 3000,
  },
  db: {
    host: "localhost",
    port: 27017,
    name: "shopPROD",
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "",
  },
};

const test: AppConfig = {
  app: {
    port: 1235,
  },
  db: {
    host: "localhost",
    port: 27017,
    name: "shopTEST",
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "",
  },
};


const config: Record<NodeEnv, AppConfig> = { dev, prod, test };

const env =
  (process.env.NODE_ENV as NodeEnv) === "prod" ? "prod" : "dev";

export default config[env];