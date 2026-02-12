// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import { register } from "./metrics";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "node:path";
import routerGeneral from './routes';


// 1. i18next configuration
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en", // default language
        backend: {
            loadPath: path.join(__dirname, "locales/{{lng}}/translation.json"),
        },
        detection: {
            order: ["querystring", "header"], // ?lang=vi or Accept-Language header
            lookupQuerystring: "lang"
        }
    });

const app = express();


// Metrics endpoint for Prometheus to scrape
//http://localhost:3000/metrics
// app.get("/metrics", async (req: Request, res: Response) => {
//     res.setHeader("Content-Type", register.contentType);
//     res.end(await register.metrics());
// });

// 2. Use i18next middleware
app.use(middleware.handle(i18next));

// ---- Start middleware
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://yourdomain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


// Use Morgan middleware
app.use(morgan('dev')); // or 'combined', 'tiny', etc.
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(helmet());           // 🛡️ Secure headers

//app.use(compression());      // GZIP compression
app.use(compression({
    level: 6,// Compression level (0-9)
    threshold: 1024,// Only compress responses > 1KB
    filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));


app.use(express.json()); // Parse incoming JSON requests

// Parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));
// ---- End middleware


app.use('/', routerGeneral);

// handling error
// Custom Error type with status
interface CustomError extends Error {
    status?: number;
}

// 404 handler: Runs only if no route matches.
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: CustomError = new Error('Not Found This Url');
    error.status = 404;
    next(error);
});



// Error handler middleware
app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal server error',
    });
});
export default app;