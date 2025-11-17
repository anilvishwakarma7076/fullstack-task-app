import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import  authRouter  from './modules/auth/auth.routes';
import  studentRouter  from './modules/students/student.routes';
import  adminRouter  from './modules/admin/admin.routes';
import { errorHandler } from './middlewares/errorhandler';
import logger from './utils/logger';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Simple request logging to console in dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Global rate limiter
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/admin', adminRouter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// basic root
app.get('/', (_req, res) => res.send('School Management System API'));

export default app;