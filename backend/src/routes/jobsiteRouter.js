import express from 'express';
import {
  findJobsitesHandler, addJobsiteHandler, getJobsiteHandler,
  deleteJobsiteHandler, updateJobsiteHandler, getJobsitePreviewsHandler
} from '../controllers/jobsiteController.js';

const jobsiteRouter = express.Router();
jobsiteRouter.get('/', findJobsitesHandler);
jobsiteRouter.get('/previews', getJobsitePreviewsHandler);
jobsiteRouter.get('/:id', getJobsiteHandler);
jobsiteRouter.post('/', addJobsiteHandler);
jobsiteRouter.delete('/:id', deleteJobsiteHandler);
jobsiteRouter.put('/:id', updateJobsiteHandler);

export { jobsiteRouter };