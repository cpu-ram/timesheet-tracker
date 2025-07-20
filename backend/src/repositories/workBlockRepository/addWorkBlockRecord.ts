import dbPool from '../../config/dbPool.js';
import format from 'pg-format';
import { generateIsoTimestampString } from '../../utils/dateAndTimeFunctions.js';

export const addWorkBlockRecord = async (
  employeeId: number,
  reportedById: number,
  jobsiteId: string | null = null,
  startTime: string | null = null,
  endTime: string | null = null,
  breakStartTime: string | null = null,
  breakEndTime: string | null = null,
  dates: string[] = [],
  tempJobsiteName: string | null = null,
  tempJobsiteAddress: string | null = null,
  tempSupervisorName: string | null = null,
  additionalNotes: string | null = null
): Promise<number[]> => {

  let result: number[] = new Array<number>();

  if (!Array.isArray(dates) || dates.length === 0) {
    throw new Error('No dates provided');
  }

  const rows = dates.map(
    date => (
      [
        jobsiteId, reportedById, employeeId,
        generateIsoTimestampString({ date, time: startTime ?? '' }),
        generateIsoTimestampString({ date, time: endTime ?? '' }),
        breakStartTime, breakEndTime, date,
        tempJobsiteName,
        tempJobsiteAddress, tempSupervisorName, additionalNotes
      ]
    )
  );

  const query = format(`
    INSERT INTO work_periods(
      project_id, reported_by, employee_id,
      work_start, 
      work_end, 
      break_start, break_end, date,
      temp_project_name, 
      temp_project_location, temp_supervisor_name, additional_notes
    )
    VALUES %L
    returning id AS workBlockId;
  `, rows);

  try {
    const queryResult = await dbPool.query(query);
    result = queryResult.rows.map((row: { workBlockId: number }) => row.workBlockId);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to add record: ${error.message}`);
    }
  }
  return result;
};
