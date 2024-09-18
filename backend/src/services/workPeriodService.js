import { fetchWorkPeriods, insertWorkPeriod } from '../repositories/workPeriodRepository.js';

const getWorkPeriods = (
  userId,
  startDate,
  endDate,
) => fetchWorkPeriods(employeeId, startDate, endDate);

const addWorkPeriod = (
  startDate,
  endDate,
  jobId,
  employeeId,
) => {
  insertWorkPeriod(startDate, endDate, jobId, employeeId);
};
