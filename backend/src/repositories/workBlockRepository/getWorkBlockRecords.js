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
    work_period_id AS "workBlockId",
    project_id AS "jobsiteId",
    reported_by AS "reportedBy",
    employee_id AS "employeeId",
    work_start AS "workStartTime",
    work_end AS "workEndTime",
    break_start AS "breakStartTime",
    break_end AS "breakEndTime",
    temp_location AS "tempLocation",
    supervisor_id AS "supervisorId",
    temp_jobsite_description AS "tempJobsiteDescription"
    FROM 
      work_periods
    WHERE 
      employee_id = $1
    AND 
      reported_by = $2
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
