import { getTimesheetData } from '../services/timesheetDataService.js';

export const getTimesheetDataHandler = async (req, res) => {
  let result = undefined;
  try {
    result = await getTimesheetData(req.query.employeeId, new Date(req.query.from), new Date(req.query.to));
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}