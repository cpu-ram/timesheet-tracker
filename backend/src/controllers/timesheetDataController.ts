import { format } from 'date-fns';
import { getTimesheetData } from '../services/timesheetDataService.js';
import { Temporal } from '@js-temporal/polyfill';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { Response } from 'express';

export const getTimesheetDataHandler = async (req: AuthenticatedRequest, res: Response) => {

  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json('Access to timesheet data unauthorized: user is not logged in');
    }

    if (!req.user) {
      return res.status(401).json('Invalid request: user field missing');
    }

    if (!req.query.from || !req.query.to) {
      return res.status(400).json('Invalid request: from and to query parameters are required');
    }

    const { from, to } = req.query;

    let fromDate: Temporal.PlainDate;
    let toDate: Temporal.PlainDate;

    try {
      fromDate = Temporal.PlainDate.from(from as string);
      toDate = Temporal.PlainDate.from(to as string);
    }
    catch (error) {
      return res.status(400).json('Invalid date format in from or to query parameters');
    }

    const employeeId = req.user.id as number;

    const result = await getTimesheetData(employeeId, fromDate, toDate);
    res.status(200).json(result);
  }
  catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
  }
}
