import {
  getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord
} from '../repositories/workBlockRepository.js';

export const getWorkBlocks = (
  employeeId,
  reportedById,
  startDateTime,
  endDateTime,
) => getWorkBlockRecords(employeeId, reportedById, startDateTime, endDateTime);

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
