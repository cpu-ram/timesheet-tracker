import { format } from 'date-fns';
import { getTimesheetData } from '../services/timesheetDataService.js';
import { Temporal } from '@js-temporal/polyfill';

export const getTimesheetDataHandler = async (req, res) => {
  let result = undefined;
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json('Access to timesheet data unauthorized: user is not logged in');
    }
    if (!req.query.from || !req.query.to) {
      throw new Error('Missing required parameters');
    }
    const employeeId = req.user.id;

    result = await getTimesheetData(employeeId, Temporal.PlainDate.from(req.query.from), Temporal.PlainDate.from(req.query.to));
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}