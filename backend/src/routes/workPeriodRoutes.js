import express from 'express';
import { getWorkPeriods } from '../controllers/workPeriodController.js';

const router = express.Router();
router.get('/', getWorkPeriods);

export default router;