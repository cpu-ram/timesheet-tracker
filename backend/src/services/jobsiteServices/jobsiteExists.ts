import { projectRecordExists } from '../../repositories/projectRepository/projectRecordExists.js';

export const jobsiteExists = async (jobsiteId: string) => {
  try {
    const result = await projectRecordExists(jobsiteId);
    return result;
  }
  catch (error) {
    throw error;
  }
}
