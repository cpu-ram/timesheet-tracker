import pool from '../config/db.js';
import { format } from 'date-fns';

export const addWorkBlockRecord = async (
  employeeId,
  projectId = null,
  startTime = null,
  endTime = null,
  reportedById = null,
  breakStartTime = null,
  breakEndTime = null,
) => {
  const query = `
    INSERT INTO work_periods(project_id, reported_by, employee_id,
    work_start, work_end, break_start, break_end)
    VALUES($1, $2, $3, $4, $5, $6, $7);
  `;
  const values = [projectId, reportedById, employeeId, startTime, endTime,
    breakStartTime, breakEndTime];
  try {
    const result = await pool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to add record');
  }
};
