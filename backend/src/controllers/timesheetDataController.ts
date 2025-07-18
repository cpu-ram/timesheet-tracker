import { format } from 'date-fns';
import { getTimesheetData } from '../services/timesheetDataService.js';
import { Temporal } from '@js-temporal/polyfill';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { Response } from 'express';

export const getTimesheetDataHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  if(!req.user) throw new Error('Authentification Error');
  if(!req.query) throw new Error('Invalid request');
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json('Access to timesheet data unauthorized: user is not logged in');
    }
    if (!req.query.from || !req.query.to) {
      throw new Error('Missing required parameters');
    }
    const employeeId = req.user.id as number;

    result = await getTimesheetData(employeeId, Temporal.PlainDate.from(req.query.from as string), Temporal.PlainDate.from(req.query.to as string));
    res.status(200).json(result);
  }
  catch (error) {
    if(error instanceof Error){
      res.status(500).json(error.message);
    }
  }
}
