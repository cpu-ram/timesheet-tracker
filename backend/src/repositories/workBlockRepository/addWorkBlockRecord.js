import dbPool from '../../config/dbPool.js';
import format from 'pg-format';
import { generateIsoTimestampString } from '../../utils/dateAndTimeFunctions.ts';

export const addWorkBlockRecord = async (
  employeeId,
  reportedById = null,
  jobsiteId = null,
  startTime = null,
  endTime = null,
  breakStartTime = null,
  breakEndTime = null,
  dates = [],
  tempJobsiteName = null,
  tempJobsiteAddress = null,
  tempSupervisorName = null,
  additionalNotes = null
) => {

  if (!Array.isArray(dates) || dates.length === 0) {
    throw new Error('No dates provided');
  }

  const rows = dates.map(
    date => (
      [
        jobsiteId, reportedById, employeeId,
        generateIsoTimestampString({ date: date, time: startTime }),
        generateIsoTimestampString({ date, time: endTime }),
        breakStartTime, breakEndTime, date,
        tempJobsiteName,
        tempJobsiteAddress, tempSupervisorName, additionalNotes
      ]
    )
  );

  const query = format(`
    INSERT INTO work_periods(
      project_id, reported_by, employee_id,
      work_start, 
      work_end, 
      break_start, break_end, date,
      temp_project_name, 
      temp_project_location, temp_supervisor_name, additional_notes
    )
    VALUES %L
    returning work_period_id AS workBlockId;
  `, rows);

  try {
    const result = await dbPool.query(query);
    return result.rows.map(row => row.workBlockId);
  } catch (error) {
    throw new Error(`Unable to add record: ${error.message}`);
  }
};
