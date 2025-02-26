import dbPool from '../config/dbPool.js';
import { format } from 'date-fns';
import { pgDateFormat } from './utils/pgFormats.js';

export async function fetchTimesheetDataRecords(employeeId, from, to) {
  let formattedTo = undefined;
  let formattedFrom = undefined;
  try {
    formattedFrom = from.toString();
    formattedTo = to.toString();
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
      coalesce(projects.project_address, work_periods.temp_project_location) as "jobsiteAddress",
      coalesce(projects.project_name, work_periods.temp_project_name) as "jobsiteName",
      coalesce(projects.project_id, work_periods.temp_project_id) as "jobsiteId",
      work_start as "workBlockStart",
      break_start as "breakStart",
      break_end as "breakEnd",
      work_end as "workBlockEnd",
      date as "workBlockDate",
      coalesce(employees.employee_nickname, employees.employee_name, work_periods.temp_supervisor_name) as "supervisorName",
      additional_notes as "additionalNotes"
    FROM
      work_periods
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.project_id
    LEFT JOIN 
      employees on projects.supervisor_id=employees.employee_id
    WHERE
      date >= $1 
    AND
      date <= $2
    ORDER BY
      date ASC NULLS LAST,
      work_start ASC NULLS LAST,
      work_end ASC NULLS LAST
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