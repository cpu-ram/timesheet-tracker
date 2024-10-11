import pool from '../config/db.js';
import { format } from 'date-fns';

export const addWorkBlockRecord = async (
  employeeId,
  reportedById = null,
  projectId = null,
  startTime = null,
  endTime = null,
  breakStartTime = null,
  breakEndTime = null,
  date = null,
) => {
  const query = `
    INSERT INTO work_periods(project_id, reported_by, employee_id,
    work_start, work_end, break_start, break_end, date)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8);
  `;
  const values = [projectId, reportedById, employeeId, startTime, endTime,
    breakStartTime, breakEndTime, date];
  try {
    const result = await pool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to add record');
  }
};
