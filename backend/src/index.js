import express from 'express';
import { workBlockRouter } from './routes/workBlockRouter.js';
import { jobsiteRouter } from './routes/jobsiteRouter.js';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Request details:', { method: req.method, url: req.url, body: req.body });
    next();
  })
}

// Define routes in index.js
app.use('/workBlocks/', workBlockRouter);
app.use('/jobsites/', jobsiteRouter);
app.get('/', (req, res) => res.json('Hello!'));


export default app; // Export the app instance
