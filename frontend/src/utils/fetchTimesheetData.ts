import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

const fetchTimesheetData = async ({ from, to, userId }) => {
  const fromDateString = format(from, 'yyyy-MM-dd');
  const toDateString = format(to, 'yyyy-MM-dd');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = '/reports/weekly/data';

  try {

    const response = await fetch(`${baseUrl}${timesheetDataSubPath}?employeeId=${userId}&from=${fromDateString}&to=${toDateString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch timesheet data');
    }
    const data = await response.json();

    const modifiedData =
      data ?
        data.map((day) => ({
          date: new Date(day.date),
          workBlocks:
            day.workBlocks.length > 0 ?
              day.workBlocks.map((workBlock) => (
                {
                  ...workBlock,
                  workBlockStart:
                    workBlock.workBlockStart ? Temporal.PlainDateTime.from(workBlock.workBlockStart) : null,
                  workBlockEnd:
                    workBlock.workBlockEnd ? Temporal.PlainDateTime.from(workBlock.workBlockEnd) : null,
                  breakStart:
                    workBlock.breakStart ? Temporal.PlainDateTime.from(workBlock.breakStart) : null,
                  breakEnd:
                    workBlock.breakEnd ? Temporal.PlainDateTime.from(workBlock.breakEnd) : null
                }
              )).sort(
                (a, b) => {
                  if (a.workBlockStart && b.workBlockStart) {
                    return Temporal.PlainDateTime.compare(a.workBlockStart, b.workBlockStart);
                  }
                  if (a.workBlockStart) {
                    return -1;
                  }
                  if (b.workBlockStart) {
                    return 1;
                  }
                  return 0;
                }
              )
              : []
        }))
        : []
      ;

    return modifiedData;
  }
  catch (error) {
    throw new Error(error);
  }
}

export default fetchTimesheetData;
