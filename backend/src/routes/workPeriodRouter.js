import express from 'express';
import getWorkPeriods from '../controllers/workPeriodController.js';

const workPeriodRouter = express.Router();
workPeriodRouter.get('/', getWorkPeriods);

export default workPeriodRouter;
