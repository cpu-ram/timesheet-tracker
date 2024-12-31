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
  projectId = null,
  startDateTime = null,
  endDateTime = null,
  breakStartTime = null,
  breakEndTime = null,
  date = null,
) => {
  addWorkBlockRecord(
    employeeId,
    reportedById,
    projectId,
    startDateTime,
    endDateTime,
    breakStartTime,
    breakEndTime,
    date,
  );
};

export const deleteWorkBlock = (workBlockId) => deleteWorkBlockRecord(workBlockId);
