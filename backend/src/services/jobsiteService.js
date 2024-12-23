import { findProjectRecords, addProjectRecord, fetchDefaultProjectPropertiesRecord } from '../repositories/projectRepository.js';

export async function addJobsite(
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
  return await addProjectRecord(
    id,
    type,
    address,
    name,
    supervisorId,
    defaultWorkStartTime,
    defaultWorkEndTime,
    defaultBreakStartTime,
    defaultBreakEndTime,
  );
}

export async function getDefaultJobsiteProperties(jobId) {
  let queryResult = undefined;
  try {
    queryResult = await fetchDefaultProjectPropertiesRecord(jobId);
  }
  catch (error) {
    throw new Error(error);
  }
  if (queryResult.rowCount === 0) {
    return null;
  }
  const renameMap = {
    default_work_start_time: 'workStartTime',
    default_work_end_time: 'workEndTime',
    default_break_start_time: 'breakStartTime',
    default_break_end_time: 'breakEndTime',
  };

  const result = Object.fromEntries(
    Object.entries(queryResult).map(([key, value]) => {
      const newKey = renameMap[key];
      if (value) {
        const [hours, minutes] = value.split(':').map(Number);
        return [newKey, { hours, minutes }];
      }
      return [newKey, null];
    }),
  );
  return result;
}

export async function findJobsites(queryString) {
  let result = undefined;
  try {
    result = await findProjectRecords(queryString);
  }
  catch (error) { throw new Error(error) };
  if (result.rowCount === 0) return null;

  return result;
}

export { getJobsite } from './jobsiteServices/getJobsite.js';