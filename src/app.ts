import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

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