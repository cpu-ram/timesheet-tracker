import { Router } from 'express';
import { getTimesheetDataHandler } from '../controllers/timesheetDataController.js';
import { generateTimesheetReportHandler } from '../controllers/timesheetReportController.js';

const reportRouter: Router = Router();
reportRouter.get('/weekly/data', getTimesheetDataHandler);
reportRouter.post('/weekly/generate', generateTimesheetReportHandler);

export { reportRouter };