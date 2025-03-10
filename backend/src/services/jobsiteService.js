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

  const result = Object.fromEntries(
    Object.entries(queryResult).map(([key, value]) => {
      if (value) {
        const [hours, minutes] = value.split(':').map(Number);
        return [key, { hours, minutes }];
      }
      else return [key, value];
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

  return result;
}

export { getJobsite } from './jobsiteServices/getJobsite.js';