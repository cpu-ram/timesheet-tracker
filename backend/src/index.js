import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import dbPool from './config/dbPool.js';
import PgSession from 'connect-pg-simple';
import './config/passportConfig.js';
import { workBlockRouter } from './routes/workBlockRouter.js';
import { jobsiteRouter } from './routes/jobsiteRouter.js';
import { reportRouter } from './routes/reportRouter.js';
import { employeeRouter } from './routes/employeeRouter.js';
import authRouter from './routes/authRouter.js'

dotenv.config();
const corsOrigins=process.env.CORS_ORIGINS?.split(',') ?? [];

const app = express();

app.use(cors({
  origin: corsOrigins,
  exposedHeaders: ['Content-Disposition', 'X-File-Name'],
  credentials: true,
}));
app.set('trust proxy', 1);
app.use(session({
  store: new (PgSession(session))({ pool: dbPool }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV==='production'? 'none' : 'lax',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
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

app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message });
});

export default app;
