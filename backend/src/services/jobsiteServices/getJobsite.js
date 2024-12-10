import { fetchProjectRecord } from '../../repositories/projectRepository.js';

export async function getJobsite(jobId) {
  const defaultProperties = await fetchProjectRecord(jobId);
  const renameMap = {
    default_work_start_time: 'workStartTime',
    default_work_end_time: 'workEndTime',
    default_break_start_time: 'breakStartTime',
    default_break_end_time: 'breakEndTime', // extend this renameMap to include the new fields

    project_id: 'jobsiteId',
    project_type: 'jobsiteType',
    project_address: 'jobsiteAddress',
    project_name: 'jobsiteName',
    supervisor_id: 'supervisorId',
  };
  const newTimeFields = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

  const result = Object.fromEntries(
    Object.entries(defaultProperties).map(([key, value]) => {
      /* add logic to check if renameMap has a matching key, 
      and then perform the logic that is within the if block, first isolating it to a separate function, 
      otherwise return the key-value pair as is
      */
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
