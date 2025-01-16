import { fetchProjectRecord } from '../../repositories/projectRepository.js';

export async function getJobsite(jobId) {
  let jobsiteRecord = undefined;
  try {
    jobsiteRecord = await fetchProjectRecord(jobId);
  }
  catch (error) {
    throw new Error(error);
  }
  const timeFields = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

  const result = Object.fromEntries(
    Object.entries(jobsiteRecord).map(([key, value]) => {
      if (timeFields.includes(key) && !!value) {
        const [hours, minutes] = value.split(':').map(Number);
        return [key, { hours, minutes }];
      }
      return [key, value];
    }),
  );

  return result;
}