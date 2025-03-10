import dbPool from '../../config/dbPool.js';
import { format } from 'date-fns';

export const addWorkBlockRecord = async (
  employeeId,
  reportedById = null,
  jobsiteId = null,
  startTime = null,
  endTime = null,
  breakStartTime = null,
  breakEndTime = null,
  date = null,
  tempJobsiteId = null,
  tempJobsiteName = null,
  tempJobsiteAddress = null,
  tempSupervisorName = null,
  additionalNotes = null
) => {
  const query = `
    INSERT INTO work_periods(
      project_id, reported_by, employee_id,
      work_start, work_end, break_start, break_end, date,
      temp_project_id, temp_project_name, 
      temp_project_location, temp_supervisor_name, additional_notes
    )
    VALUES(
      $1, $2, $3, 
      $4, $5, $6, $7, $8,
      $9, $10, 
      $11, $12, $13
    );
  `;
  const values = [
    jobsiteId, reportedById, employeeId,
    startTime, endTime, breakStartTime, breakEndTime, date,
    tempJobsiteId, tempJobsiteName,
    tempJobsiteAddress, tempSupervisorName, additionalNotes
  ];
  try {
    const result = await dbPool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to add record');
  }
};
