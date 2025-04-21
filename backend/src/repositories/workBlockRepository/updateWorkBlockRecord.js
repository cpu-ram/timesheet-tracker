import dbPool from '../../config/dbPool.js';
import { format } from 'date-fns';

export const updateWorkBlockRecord = async (
  workBlockId,
  startTime,
  endTime,
  jobsiteId,
  tempJobsiteName,
  tempJobsiteAddress,
  tempSupervisorName,
  additionalNotes
) => {
  const query = `
    UPDATE work_periods
    SET
      work_start = $1,
      work_end=$2,
      temp_project_id=$3,
      temp_project_name=$4,
      temp_project_location=$5,
      temp_supervisor_name=$6,
      additional_notes=$7
    WHERE
      work_period_id=$8
    ;
  `
  const values = [
    startTime,
    endTime,
    jobsiteId,
    tempJobsiteName,
    tempJobsiteAddress,
    tempSupervisorName,
    additionalNotes,
    workBlockId
  ];
  try {
    const result = await dbPool.query(query, values);
    return true;
  }
  catch (error) {
    throw new Error('Unable to update record');
  }
}