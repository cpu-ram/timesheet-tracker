import { getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord } from '../repositories/workBlockRepository.js';

const getWorkBlocks = (
  userId,
  startDateTime,
  endDateTime,
) => getWorkBlockRecords(employeeId, startDateTime, endDateTime);

const addWorkBlock = (
  startDateTime,
  endDateTime,
  jobId,
  employeeId,
) => {
  addWorkBlockRecord(startDateTime, endDateTime, jobId, employeeId);
};

const deleteWorkBlock = (
  workBlockId => return deleteWorkBlockRecord(workBlockId);
)
