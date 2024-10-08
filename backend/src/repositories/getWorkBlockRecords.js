import pool from '../config/db.js';
import { format } from 'date-fns';
import { pgDateFormat } from './utils/pgFormats.js';

export const getWorkBlockRecords = async (
  employeeId,
  startDate,
  endDate,
) => {
  const formattedStartDate = format(startDate, pgDateFormat);
  const formattedEndDate = format(endDate, pgDateFormat);
  const query = `
    SELECT * FROM work_intervals
    WHERE employee_id = $1
    AND work_start >= $2
    AND work_end <= $3;
  `;
  const values = [employeeId, formattedStartDate, formattedEndDate];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error('Unable to fetch work block records');
  }
};
