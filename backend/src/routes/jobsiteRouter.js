import express from 'express';
import { getJobsites, addJobsiteHandler } from '../controllers/jobsiteController.js';

const jobsiteRouter = express.Router();
jobsiteRouter.get('/', (req, res) => res.json(''));
jobsiteRouter.get('/:query', getJobsites);
jobsiteRouter.post('/', addJobsiteHandler);

export { jobsiteRouter };