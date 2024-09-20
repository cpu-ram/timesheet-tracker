import {
  getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord
} from '../repositories/workBlockRepository.js';

export const getWorkBlocks = (
  employeeId,
  startDateTime,
  endDateTime,
) => getWorkBlockRecords(employeeId, startDateTime, endDateTime);

export const addWorkBlock = (
  startDateTime,
  endDateTime,
  jobId,
  employeeId,
) => {
  addWorkBlockRecord(startDateTime, endDateTime, jobId, employeeId);
};

export const deleteWorkBlock = workBlockId => deleteWorkBlockRecord(workBlockId);

