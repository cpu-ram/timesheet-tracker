import {
  getWorkBlockRecords, updateWorkBlockRecord, deleteWorkBlockRecord,
} from '../../repositories/workBlockRepository.js';

import { jobsiteExists, addJobsite } from '../jobsiteService.js';

export async function getWorkBlocks(
  employeeId,
  reportedById,
  startDate,
  endDate,
) {
  let result = undefined;
  try {
    result = await getWorkBlockRecords(employeeId, reportedById, startDate, endDate);
  }
  catch (error) { throw new Error(error); }

  return result;
}

export const updateWorkBlock = async (
  workBlockId,
  startTime,
  endTime,
  jobsiteId,
  tempJobsiteName,
  tempJobsiteAddress,
  tempSupervisorName,
  additionalNotes
) => {
  try {
    let newJobsiteCreated = false;
    if (jobsiteId && !(await jobsiteExists(jobsiteId))) {
      newJobsiteCreated = await addJobsite(
        {
          id: jobsiteId,
          name: tempJobsiteName,
          address: tempJobsiteAddress,
        }
      );
    }

    const updateResult: boolean = await updateWorkBlockRecord(
      workBlockId,
      startTime,
      endTime,
      jobsiteId,
      jobsiteId ? null : tempJobsiteName,
      jobsiteId ? null : tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    );
    return {
      success: updateResult,
      newJobsiteCreated: !!newJobsiteCreated || false,
      jobsiteId: jobsiteId || null,
    } as {
      success: boolean;
      newJobsiteCreated: boolean;
      jobsiteId?: string | null;
    };
  }
  catch (error) {
    throw error;
  }
}

export const deleteWorkBlock = (workBlockId) => deleteWorkBlockRecord(workBlockId);
export { addWorkBlock } from './addWorkBlock.js';