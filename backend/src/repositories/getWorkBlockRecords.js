import pool from '../config/db.js';

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
