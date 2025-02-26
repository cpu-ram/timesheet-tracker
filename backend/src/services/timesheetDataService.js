import { parse, isValid, differenceInCalendarDays, addDays } from 'date-fns';
import { fetchTimesheetDataRecords } from '../repositories/timesheetDataRepository.js';
import { Temporal } from '@js-temporal/polyfill';

export async function getTimesheetData(employeeId, from, to) {
  let result = undefined;
  try {
    if (!from || !to) {
      throw new Error('Invalid date format');
    }
    let [fromDate, toDate] = [from, to];


    result = Array.from(
      { length: fromDate.until(toDate, { largestUnit: 'days', smallestUnit: 'days' }).days + 1 },
      (_, index) => fromDate.add({ days: index })
    ).map(
      date => ({
        date: date,
        workBlocks: [],
      })
    );

    let data = await fetchTimesheetDataRecords(employeeId, fromDate, toDate);

    if (data === null) return result;

    for (let record of data) {
      let recordDate = Temporal.PlainDate.from(record.workBlockDate);
      let dateIndex = fromDate.until(recordDate, { largestUnit: 'days', smallestUnit: 'days' }).days;
      result[dateIndex].workBlocks.push(record);
    }
  }
  catch (error) {
    throw error;
  }
  return result;
}
