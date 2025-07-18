import { addWorkBlockRecord } from '../../repositories/workBlockRepository/addWorkBlockRecord.js';
import { addJobsite } from '../jobsiteService.js';
import { jobsiteExists } from '../jobsiteServices/jobsiteExists.js';

export const addWorkBlock = async (
  employeeId: number,
  reportedById: number,
  jobsiteId: string | null = null,
  startDateTime = null,
  endDateTime = null,
  breakStartTime = null,
  breakEndTime = null,
  dates: string[] = [],
  tempJobsiteName: string | null = null,
  tempJobsiteAddress: string | null = null,
  tempSupervisorName: string | null = null,
  additionalNotes: string | null = null
) => {
  if (dates.length === 0) {
    throw new RangeError("No dates provided for work block creation");
  }
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
    const createdWorkBlockIds =
      await addWorkBlockRecord(
        employeeId,
        reportedById,
        jobsiteId,
        startDateTime,
        endDateTime,
        breakStartTime,
        breakEndTime,
        dates,
        jobsiteId ? null : tempJobsiteName,
        jobsiteId ? null : tempJobsiteAddress,
        tempSupervisorName,
        additionalNotes
      );
    return {
      success: true,
      workBlockIds: createdWorkBlockIds,
      newJobsiteCreated: !!newJobsiteCreated || false,
      jobsiteId: jobsiteId || null,
    };
  }

  catch (error) {
    throw error;
  }
}
