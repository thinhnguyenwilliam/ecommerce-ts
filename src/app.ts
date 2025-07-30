import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { Request, Response } from 'express';

const app = express();

// ---- Start middleware
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


app.use(express.json());
// ---- End middleware

app.get('/', (_req, res) => {
    res.json({
        message: 'Hello from Express + TypeScript!',
        status: 'success'
    });
});


export default app;