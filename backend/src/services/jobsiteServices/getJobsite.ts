import { fetchProjectRecord } from '../../repositories/projectRepository.js';

export async function getJobsite(jobsiteId: string) {
  let jobsiteRecord = undefined;
  try {
    jobsiteRecord = await fetchProjectRecord(jobsiteId);
  }
  catch (error) {
    throw error;
  }
  return jobsiteRecord;
}
