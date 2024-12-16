import { fetchProjectRecord } from '../../repositories/projectRepository.js';

export async function getJobsite(jobId) {
  let jobsiteRecord = undefined;
  try {
    jobsiteRecord = await fetchProjectRecord(jobId);
  }
  catch (error) {
    throw new Error(error);
  }
  if (jobsiteRecord === null) {
    return null;
  }
  const renameMap = {
    default_work_start_time: 'workStartTime',
    default_work_end_time: 'workEndTime',
    default_break_start_time: 'breakStartTime',
    default_break_end_time: 'breakEndTime',

    project_id: 'id',
    project_type: 'type',
    project_address: 'address',
    project_name: 'name',
    supervisor_id: 'supervisorId',
  };
  const newTimeFields = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

  const result = Object.fromEntries(
    Object.entries(jobsiteRecord).map(([key, value]) => {
      const newKey = renameMap[key];
      if (value) {
        if (newTimeFields.includes(newKey)) {
          const [hours, minutes] = value.split(':').map(Number);
          return [newKey, { hours, minutes }];
        }
        return [newKey, value];
      }
      else return [newKey, null];
    }),
  );
  return result;
}
