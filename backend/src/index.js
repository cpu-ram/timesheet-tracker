import express from 'express';
import cors from 'cors';
import { workBlockRouter } from './routes/workBlockRouter.js';
import { jobsiteRouter } from './routes/jobsiteRouter.js';
import { reportRouter } from './routes/reportRouter.js';
import { employeeRouter } from './routes/employeeRouter.js';

const app = express();
app.use(express.json());
app.use(cors());

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
app.get('/', (req, res) => res.json('Hello!'));

export default app;
