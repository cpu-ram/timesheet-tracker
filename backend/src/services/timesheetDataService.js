import { parse, isValid, differenceInCalendarDays, addDays } from 'date-fns';
import { fetchTimesheetDataRecords } from '../repositories/timesheetDataRepository.js';

export async function getTimesheetData(employeeId, from, to) {
  let result = undefined;
  try {
    let [fromDate, toDate] = [from, to].map(date => parse(date, 'yyyy-MM-dd', new Date()));
    if (!from || !to || !isValid(fromDate) || !isValid(toDate)) {
      throw new Error('Invalid date format');
    }

    result = Array.from(
      { length: differenceInCalendarDays(toDate, fromDate) + 1 },
      (_, index) => addDays(fromDate, index)
    ).map(
      date => ({
        date: date,
        workBlocks: [],
      })
    );

    let data = await fetchTimesheetDataRecords(employeeId, fromDate, toDate);

    if (data === null) return result;

    for (let record of data) {
      let recordDate = record.workBlockDate;
      let dateIndex = differenceInCalendarDays(recordDate, fromDate);
      result[dateIndex].workBlocks.push(record);
    }
  }
  catch (error) {
    throw new Error(error);
  }
  return result;
}
