import workBlockRecords from './data/sampleWorkBlocks.js';
import { jobsDefaultSchedule } from './data/jobsDefaultSchedule.js';

export const getWorkBlockRecords = (
  employeeId,
  startDate,
  endDate,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return workBlockRecords.filter(
    (element) => element.employeeId === employeeId
      && new Date(element.startTime) >= start
      && new Date(element.endTime) <= end,
  );
};

export const addWorkBlockRecord = (
  startTime,
  endTime,
  jobId,
  employeeId,
) => {
  const newId = workBlockRecords.map((x) => x.id).reduce((x, y) => Math.max(x, y), 0) + 1;
  workBlockRecords.push({
    id: newId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    jobId,
    employeeId,
  });
};

export function deleteWorkBlockRecord(workBlockRecordId) {
  const index = workBlockRecords.findIndex((x) => x.id === workBlockRecordId);
  if (index !== -1) {
    workBlockRecords.splice(index, 1);
    return true;
  }
  return false;
}

export const getDefaultJobsiteProperties = (jobId) => {
  const defaultProperties = jobsDefaultSchedule.find(x => x.jobId === jobId);
  return defaultProperties;
}
