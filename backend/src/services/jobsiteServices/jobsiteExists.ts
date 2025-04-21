import { projectRecordExists } from '../../repositories/projectRepository/projectRecordExists.js';

export const jobsiteExists = async (jobsiteId) => {
  try {
    const result = await projectRecordExists(jobsiteId);
    return result;
  }
  catch (error) {
    throw new Error(error);
  }
}