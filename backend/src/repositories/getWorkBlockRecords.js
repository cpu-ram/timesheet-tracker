import pool from '../config/db.js';
import { format } from 'date-fns';

export const getWorkBlockRecords = async (
  employeeId,
  startDate,
  endDate,
) => {
  pgDateFormat = 'yyyy-MM-dd HH:mm:ss';
  const formattedStartDate = format(startDate, pgDateFormat);
  const formattedEndDate = format(endDate, pgDateFormat);
  const query = `
    SELECT * FROM work_periods
    WHERE employee_id = $1
    AND work_start> = #2
    AND work_end <= $3;
  `;
  const values = [employee_id, formattedStartDate, formattedEndDate];

  const result = await pool.query(query, values);
  return result.rows;
};
