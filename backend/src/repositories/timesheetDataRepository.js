import dbPool from '../config/dbPool.js';
import { format } from 'date-fns';
import { pgDateFormat } from './utils/pgFormats.js';

export async function fetchTimesheetDataRecords(employeeId, from, to) {
  let formattedTo = undefined;
  let formattedFrom = undefined;
  try {
    formattedFrom = format(from, pgDateFormat);
    formattedTo = format(to, pgDateFormat);
  }
  catch (error) {
    if (error instanceof RangeError
    ) {
      throw new Error('Invalid date format');
    }
    throw new Error("Unable to fetch timesheet data");
  }
  const query = `
    SELECT 
      work_periods.work_period_id as "workBlockId",
      projects.project_address as "jobsiteAddress",
      projects.project_name as "jobsiteName",
      projects.project_id as "jobsiteId",
      work_start as "workBlockStart",
      break_start as "breakStart",
      break_end as "breakEnd",
      work_end as "workBlockEnd"
    FROM
      work_periods 
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.project_id
    WHERE
      date >= $1 
    AND
      date <= $2
    ;
  `;
  const values = [formattedFrom, formattedTo];
  let result = undefined;
  try {
    result = await dbPool.query(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows;
  }
  catch (error) {
    throw new Error('Unable to fetch timesheet data records');
  }

}
