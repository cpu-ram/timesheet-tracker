import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import dbPool from './config/dbPool.js';
import connectPgSimple from 'connect-pg-simple';
import './config/passportConfig.js';
import { workBlockRouter } from './routes/workBlockRouter.js';
import { jobsiteRouter } from './routes/jobsiteRouter.js';
import { reportRouter } from './routes/reportRouter.js';
import { employeeRouter } from './routes/employeeRouter.js';
import authRouter from './routes/authRouter.js'
import { AuthenticatedRequest } from './types/AuthenticatedRequest.js';
import { Request, Response, NextFunction } from 'express';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

dotenv.config();
console.log(`Backend running in ${process.env.NODE_ENV} mode`);
const corsOrigins = process.env.CORS_ORIGINS?.split(',') ?? [];

const app = express();
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET is not set in environment variables');

const PgSession = connectPgSimple(session);

app.use(cors({
  origin: corsOrigins,
  exposedHeaders: ['Content-Disposition', 'X-File-Name'],
  credentials: true,
}));
app.set('trust proxy', 1);
app.use(session({
  store: new PgSession({ pool: dbPool }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Request details:', { method: req.method, url: req.url, body: req.body });
    next();
  })
}

app.use('/workBlocks/', workBlockRouter);
app.use('/jobsites/', jobsiteRouter);
app.use('/reports/', reportRouter);
app.use('/employees/', employeeRouter)
app.use('/auth', authRouter);
app.get('/', (req, res) => res.json('Hello!'));

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  console.error('Unhandled server error:', err);

  let errMessage = (err instanceof Error) ? err.message : 'Unknown error';
  res.status(500).json({ error: errMessage });
});

export default app;
