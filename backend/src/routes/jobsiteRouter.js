import express from 'express';
import { getJobsites } from '../controllers/jobsiteController.js';

const jobsiteRouter = express.Router();
jobsiteRouter.get('/', (req, res) => res.json(''));
jobsiteRouter.get('/:query', getJobsites);

export { jobsiteRouter };