import {
  getWorkBlockRecords, updateWorkBlockRecord, deleteWorkBlockRecord,
} from '../../repositories/workBlockRepository.js';

import { jobsiteExists, addJobsite } from '../jobsiteService.js';

export async function getWorkBlocks(
  employeeId: number,
  reportedById: number,
  startDate: Date,
  endDate: Date,
) {
  let result = undefined;
  try {
    result = await getWorkBlockRecords(employeeId, reportedById, startDate, endDate);
  }
  catch (error) { throw error; }

  return result;
}

export const updateWorkBlock = async (
  workBlockId: number,
  startTime: string,
  endTime: string,
  jobsiteId: string,
  tempJobsiteName: string,
  tempJobsiteAddress: string,
  tempSupervisorName: string,
  additionalNotes: string
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
      tempJobsiteName,
      tempJobsiteAddress,
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

export const deleteWorkBlock = (workBlockId: number) => deleteWorkBlockRecord(workBlockId);
export { addWorkBlock } from './addWorkBlock.js';
