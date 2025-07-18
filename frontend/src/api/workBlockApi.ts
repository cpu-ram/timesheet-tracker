import { ApiError } from '../errors/ApiError.js';
import { WorkBlockData } from '../types/WorkBlock.types.js';
import { Temporal } from '@js-temporal/polyfill';

export const addWorkBlock = async (workBlockData: WorkBlockData, selectedDates: Temporal.PlainDate[]) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/workBlocks`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startTime: workBlockData.workBlockStart?.toString() ?? null,
        endTime: workBlockData.workBlockEnd?.toString() ?? null,
        dates: selectedDates,
        jobsiteId: workBlockData.jobsiteId ? workBlockData.jobsiteId : null,
        tempJobsiteName: workBlockData.jobsiteName ? workBlockData.jobsiteName : null,
        tempJobsiteAddress: workBlockData.jobsiteAddress ? workBlockData.jobsiteAddress : null,
        tempSupervisorName: workBlockData.supervisorName ? workBlockData.supervisorName : null,
        additionalNotes: workBlockData.additionalNotes ? workBlockData.additionalNotes : null,
      }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(400, 'Failed to submit work block: ' + (responseData.message || 'Unknown error'));
    }

    return responseData;
  }
  catch (error) {
    throw error;
  }
}

export const updateWorkBlock = async (
  { workBlockId, workBlockData, date }: {
    workBlockId: number, workBlockData: WorkBlockData, date: any
  }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  try {
    const startTimeString = workBlockData.workBlockStart ? date.toString() + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null;
    const endTimeString = workBlockData.workBlockEnd ? date.toString() + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null;

    const response = await fetch(`${baseUrl}/workBlocks/${workBlockId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body:
          JSON.stringify({
            workBlockId: workBlockId,
            startTime: startTimeString,
            endTime: endTimeString,
            jobsiteId: workBlockData.jobsiteId,
            tempJobsiteName: workBlockData.jobsiteName,
            tempJobsiteAddress: workBlockData.jobsiteAddress,
            tempSupervisorName: workBlockData.supervisorName,
            additionalNotes: workBlockData.additionalNotes
          })
      }
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(500, 'Failed to submit work block: ' + (responseData.message || 'Unknown error'));
    }

    return responseData;
  }

  catch (error) {
    console.error(error);
  }
}

export const deleteWorkBlock = async (workBlockId: number) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/workBlocks/${workBlockId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new ApiError(500, 'Failed to delete work block');
    }
  }
  catch (error) {
    throw error;
  }
}
