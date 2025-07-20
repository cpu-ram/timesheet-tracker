import dbPool from '../config/dbPool.js';
import { Temporal } from '@js-temporal/polyfill';
import { format } from 'date-fns';
import { pgDateFormat } from './utils/pgFormats.js';
import { workerData } from 'worker_threads';

export async function fetchTimesheetDataRecords(employeeId: number, from: Temporal.PlainDate, to: Temporal.PlainDate) {
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
      work_periods.id as "workBlockId",
      coalesce(projects.address, work_periods.temp_project_location) as "jobsiteAddress",
      coalesce(projects.name, work_periods.temp_project_name) as "jobsiteName",
      coalesce(projects.id, work_periods.temp_project_id) as "jobsiteId",
      work_start as "workBlockStart",
      break_start as "breakStart",
      break_end as "breakEnd",
      work_end as "workBlockEnd",
      date as "workBlockDate",
      coalesce(employees.nickname, employees.name, work_periods.temp_supervisor_name) as "supervisorName",
      additional_notes as "additionalNotes"
    FROM
      work_periods
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.id
    LEFT JOIN 
      employees on projects.supervisor_id=employees.id
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
    result = result.rows.map(row =>
    ({
      ...row,
      workBlockStart: row.workBlockStart ? Temporal.PlainTime.from(row.workBlockStart) : null,
      workBlockEnd: row.workBlockEnd ? Temporal.PlainTime.from(row.workBlockEnd) : null,
    })
    )
    return result;
  }
  catch (error) {
    throw new Error('Unable to fetch timesheet data records');
  }

}
