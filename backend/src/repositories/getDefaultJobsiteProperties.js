import pool from '../config/db.js';

export const getDefaultJobsiteProperties = (jobId) => {
  const defaultProperties = jobsDefaultSchedule.find(x => x.jobId === jobId);
  return defaultProperties;
}
