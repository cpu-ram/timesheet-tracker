import { format } from 'date-fns';

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
              workBlock.workBlockStart ? new Date(workBlock.workBlockStart) : null,
            workBlockEnd:
              workBlock.workBlockEnd ? new Date(workBlock.workBlockEnd) : null,
            breakStart:
              workBlock.breakStart ? new Date(workBlock.breakStart) : null,
            breakEnd:
              workBlock.breakEnd ? new Date(workBlock.breakEnd) : null
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
