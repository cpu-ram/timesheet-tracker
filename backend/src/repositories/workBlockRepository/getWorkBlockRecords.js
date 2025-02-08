import dbPool from '../../config/dbPool.js';
import { format } from 'date-fns';
import { pgDateFormat } from '../utils/pgFormats.js';

export const getWorkBlockRecords = async (
  employeeId,
  reportedBy,
  startDate,
  endDate,
) => {
  const formattedStartDate = format(startDate, pgDateFormat);
  const formattedEndDate = format(endDate, pgDateFormat);
  const query = `
    SELECT 
    work_periods.work_period_id AS "workBlockId",
    coalesce(projects.project_id, work_periods.temp_project_id) AS "jobsiteId",
    work_periods.reported_by AS "reportedBy",
    work_periods.employee_id AS "employeeId",
    work_start AS "workStartTime",
    work_end AS "workEndTime",
    break_start AS "breakStartTime",
    break_end AS "breakEndTime",
    coalesce(projects.project_address, work_periods.temp_project_location) AS "tempLocation",
    work_periods.supervisor_id AS "supervisorId",
    work_periods.additional_notes AS "tempJobsiteDescription"
    FROM
      work_periods
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.project_id
    LEFT JOIN 
      employees on projects.supervisor_id=employees.employee_id
    WHERE 
      work_periods.employee_id = $1
    AND 
      work_periods.reported_by = $2
    AND 
      work_start >= $3
    AND 
      work_end <= $4
    ORDER BY 
      date, 
      work_start;
  `;
  const values = [employeeId, reportedBy, formattedStartDate, formattedEndDate];
  try {
    const result = await dbPool.query(query, values);
    if (result.rowCount === 0) return null;
    return result.rows;
  } catch (error) {
    throw new Error('Unable to fetch work block records');
  }
};
