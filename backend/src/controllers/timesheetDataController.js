import { format } from 'date-fns';
import { getTimesheetData } from '../services/timesheetDataService.js';

export const getTimesheetDataHandler = async (req, res) => {
  let result = undefined;
  try {
    result = await getTimesheetData(req.query.employeeId, req.query.from, req.query.to);
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}