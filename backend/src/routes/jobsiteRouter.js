import express from 'express';
import { findJobsitesHandler, addJobsiteHandler, getJobsiteHandler } from '../controllers/jobsiteController.js';

const jobsiteRouter = express.Router();
//jobsiteRouter.get('/', (req, res) => res.json(''));
jobsiteRouter.get('/', findJobsitesHandler);
jobsiteRouter.get('/:id', getJobsiteHandler);

jobsiteRouter.post('/', addJobsiteHandler);

export { jobsiteRouter };