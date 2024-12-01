import express from 'express';
import { workPeriodRouter } from './routes/workPeriodRouter.js';
import { jobsiteRouter } from './routes/jobsiteRouter.js';

const app = express();
app.use(express.json());

// Define routes in index.js
app.use('/work_periods/', workPeriodRouter);
app.use('/jobsites/', jobsiteRouter);
app.get('/', (req, res) => res.json('Hello!'));


export default app; // Export the app instance
