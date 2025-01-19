import {
  getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord
} from '../repositories/workBlockRepository.js';

export async function getWorkBlocks(
  employeeId,
  reportedById,
  startDateTime,
  endDateTime,
) {
  let result = undefined;
  try {
    result = await getWorkBlockRecords(employeeId, reportedById, startDateTime, endDateTime);
  }
  catch (error) { throw new Error(error); }

  return result;
}

export const addWorkBlock = (
  employeeId,
  reportedById,
  jobsiteId = null,
  startDateTime = null,
  endDateTime = null,
  breakStartTime = null,
  breakEndTime = null,
  date = null,
  tempJobsiteId = null,
  tempJobsiteName = null,
  tempJobsiteAddress = null,
  tempSupervisorName = null,
  additionalNotes = null
) => {
  addWorkBlockRecord(
    employeeId,
    reportedById,
    jobsiteId,
    startDateTime,
    endDateTime,
    breakStartTime,
    breakEndTime,
    date,
    tempJobsiteId,
    tempJobsiteName,
    tempJobsiteAddress,
    tempSupervisorName,
    additionalNotes
  );
};

export const deleteWorkBlock = (workBlockId) => deleteWorkBlockRecord(workBlockId);
