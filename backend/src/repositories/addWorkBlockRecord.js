import pool from '../config/db.js';

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
