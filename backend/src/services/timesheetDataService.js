import { fetchTimesheetDataRecords } from '../repositories/timesheetDataRepository.js';

export async function getTimesheetData(employeeId, from, to) {
  let result = undefined;
  try {
    result = await fetchTimesheetDataRecords(employeeId, from, to);
  }
  catch (error) {
    throw new Error(error);
  }
  return result;
}
