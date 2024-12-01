import { findProjectRecords, addProjectRecord, getDefaultProjectPropertiesRecord } from '../repositories/projectRepository.js';

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
    defaultStartTime,
    defaultEndTime,
    defaultBreakStartTime,
    defaultBreakEndTime,
  );
}

export async function getDefaultJobsiteProperties(jobId) {
  const defaultProperties = await getDefaultProjectPropertiesRecord(jobId);
  const renameMap = {
    default_work_start_time: 'workStartTime',
    default_work_end_time: 'workEndTime',
    default_break_start_time: 'breakStartTime',
    default_break_end_time: 'breakEndTime',
  };

  const result = Object.fromEntries(
    Object.entries(defaultProperties).map(([key, value]) => {
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
  return await findProjectRecords(queryString);
}

