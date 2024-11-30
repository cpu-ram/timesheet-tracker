import express from 'express';
import workPeriodRouter from './routes/workPeriodRouter.js';
import { findJobsiteRecords } from './repositories/findJobsiteRecords.js';

const app = express();
app.use(express.json());

// Define routes in index.js
app.use('/work_periods/', workPeriodRouter);
app.get('/', (req, res) => res.json('Hello!'));
app.get('/jobsites/:query', async (req, res) => {
  const result = await findJobsiteRecords(req.params.query);
  res.json(result);
})

export default app; // Export the app instance
