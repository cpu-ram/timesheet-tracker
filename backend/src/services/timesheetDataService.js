import { parse, isValid } from 'date-fns';
import { fetchTimesheetDataRecords } from '../repositories/timesheetDataRepository.js';

export async function getTimesheetData(employeeId, from, to) {
  let result = undefined;
  try {
    [from, to] = [from, to].map(date => parse(date, 'yyyy-MM-dd', new Date()));
    if (!from || !to || !isValid(from) || !isValid(to)) {
      throw new Error('Invalid date format');
    }

    result = await fetchTimesheetDataRecords(employeeId, from, to);
  }
  catch (error) {
    throw new Error(error);
  }
  return result;
}
