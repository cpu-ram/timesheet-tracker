import { getWorkBlockRecords, addWorkBlockRecord } from '../repositories/workBlockRepository.js';

const getWorkBlocks = (
  userId,
  startDate,
  endDate,
) => getWorkBlockRecords(employeeId, startDate, endDate);

const addWorkBlock = (
  startDate,
  endDate,
  jobId,
  employeeId,
) => {
  addWorkBlockRecord(startDate, endDate, jobId, employeeId);
};
