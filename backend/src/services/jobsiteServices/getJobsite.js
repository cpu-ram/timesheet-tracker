import { fetchProjectRecord } from '../../repositories/projectRepository.js';

export async function getJobsite(jobsiteId) {
  let jobsiteRecord = undefined;
  try {
    jobsiteRecord = await fetchProjectRecord(jobsiteId);
  }
  catch (error) {
    throw new Error(error);
  }
  return jobsiteRecord;
}