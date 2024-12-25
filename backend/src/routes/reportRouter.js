import express from 'express';
import { getTimesheetDataHandler } from '../controllers/timesheetDataController.js';

const reportRouter = express.Router();
reportRouter.get('/weekly/data', getTimesheetDataHandler);

export { reportRouter };