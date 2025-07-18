import { Temporal } from '@js-temporal/polyfill';

const fetchTimesheetData = async ({ from, to} : { from: Temporal.PlainDate, to: Temporal.PlainDate}) => {
  const fromDateString = from.toString();
  const toDateString = to.toString();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = '/reports/weekly/data';

  try {
    const response = await fetch(
      `${baseUrl}${timesheetDataSubPath}?from=${fromDateString}&to=${toDateString}`,
      {
        method: 'GET',
        credentials: 'include',
      });
    if (!response.ok) {
      console.error('Failed to fetch timesheet data:') + response.statusText;
      throw new Error('Failed to fetch timesheet data');
    }
    const data = await response.json();

    const modifiedData =
      data ?
        data.map((day:{
	  date: string;
	  workBlocks: {
	    workBlockStart?: string;
	    workBlockEnd?: string;
	    breakStart?: string;
	    breakEnd?: string;
	  }[];
        }) => ({
          date: Temporal.PlainDate.from(day.date),
          workBlocks:
            day.workBlocks.length > 0 ?
              day.workBlocks.map((workBlock) => (
                {
                  ...workBlock,
                  workBlockStart:
                    workBlock.workBlockStart ? Temporal.PlainTime.from(workBlock.workBlockStart) : null,
                  workBlockEnd:
                    workBlock.workBlockEnd ? Temporal.PlainTime.from(workBlock.workBlockEnd) : null,
                  breakStart:
                    workBlock.breakStart ? Temporal.PlainTime.from(workBlock.breakStart) : null,
                  breakEnd:
                    workBlock.breakEnd ? Temporal.PlainTime.from(workBlock.breakEnd) : null
                }
              ))
              : []
        }))
        : []
      ;

    return modifiedData;
  }
  catch (error) {
    console.error('Error fetching timesheet data:', error);
    throw error;
  }
}

export default fetchTimesheetData;
