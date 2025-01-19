import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

const fetchTimesheetData = async ({ date, userId }) => {
  const dateString = format(date, 'yyyy-MM-dd');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = '/reports/weekly/data';

  try {

    const response = await fetch(`${baseUrl}${timesheetDataSubPath}?employeeId=${userId}&from=${dateString}&to=${dateString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch timesheet data');
    }
    const data = await response.json();

    const modifiedData =
      data ?
        data.map((workBlock) => (
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
        ))
        :
        null;
    return modifiedData;
  }
  catch (error) {
    throw new Error(error);
  }
}

export default fetchTimesheetData;
