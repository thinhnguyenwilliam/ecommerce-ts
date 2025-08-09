import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";

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

import routerGeneral from './routes';
app.use('/', routerGeneral);


export default app;