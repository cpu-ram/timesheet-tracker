import dbPool from '../config/dbPool.js';
import { format } from 'date-fns';
import { pgDateFormat } from './utils/pgFormats.js';

export async function fetchTimesheetDataRecords(employeeId, from, to) {
  const formattedFrom = format(from, pgDateFormat);
  const formattedTo = format(to, pgDateFormat);
  const query = `
    SELECT 
      projects.project_address as projectAddress,
      projects.project_name as projectName,
      projects.project_id as projectId,
      work_start as workPeriodStart,
      break_start as breakStart,
      break_end as breakEnd,
      work_end as workPeriodEnd
    FROM
      work_periods 
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.project_id
    WHERE
      work_start >= $1 
    AND
      work_end <= $2
    ;
  `;
  const values = [formattedFrom, formattedTo];
  let result = undefined;
  try {
    result = await dbPool.query(query, values);
  }
  catch (error) {
    throw new Error('Unable to fetch timesheet data records');
  }
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows;
}
