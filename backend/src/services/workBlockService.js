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
  projectId,
  startDateTime,
  endDateTime,
  breakStartTime,
  breakEndTime,
  date
) => {
  addWorkBlockRecord(
    employeeId,
    reportedById,
    projectId,
    startDateTime,
    endDateTime,
    breakStartTime,
    breakEndTime,
    date
  );
};

export const deleteWorkBlock = workBlockId => deleteWorkBlockRecord(workBlockId);

export function getDefaultJobsiteProperties(jobId) {
  return getDefaultJobsitePropertiesRecord(jobId);
}

export function addProject(
  id,
  type = null,
  address = null,
  name = null,
  supervisorId = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  defaultBreakStartTime = null,
  defaultBreakEndTime = null,
) {
  return addProjectRecord(
    id, type, address, name, supervisorId,
    defaultStartTime, defaultEndTime,
    defaultBreakStartTime, defaultBreakEndTime
  )
}
