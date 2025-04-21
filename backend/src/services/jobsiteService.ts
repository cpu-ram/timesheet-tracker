import { add } from 'date-fns';
import {
  findProjectRecords, addProjectRecord, deleteProjectRecord, updateProjectRecord,
  fetchJobsitePreviewRecords
} from '../repositories/projectRepository.js';
import { id } from 'date-fns/locale';

import { JobsiteConstraintError } from '../errors/errors.js';

export async function addJobsite(
  {
    id,
    type = null,
    address = null,
    name = null,
    supervisorId = null,
    description = null,

    defaultWorkStartTime = null,
    defaultWorkEndTime = null,
    defaultBreakStartTime = null,
    defaultBreakEndTime = null,
  }: {
    id: string;
    type?: string | null;
    address?: string | null;
    name?: string | null;
    supervisorId?: string | null;
    description?: string | null;
    defaultWorkStartTime?: string | null;
    defaultWorkEndTime?: string | null;
    defaultBreakStartTime?: string | null;
    defaultBreakEndTime?: string | null;
  }
) {
  let result = null;
  try {
    result = await addProjectRecord({
      id: id.toUpperCase(),
      type,
      address,
      name,
      supervisorId,
      description,
      defaultWorkStartTime,
      defaultWorkEndTime,
      defaultBreakStartTime,
      defaultBreakEndTime,
    });
    return result;
  }
  catch (error) {
    throw error;
  }

}

export async function findJobsites(queryString) {
  let result = undefined;
  try {
    result = await findProjectRecords(queryString);
  }
  catch (error) { throw new Error(error) };

  return result;
}

export async function getJobsitePreviews() {
  let result = undefined;
  try {
    result = await fetchJobsitePreviewRecords();
  }
  catch (error) {
    throw new Error(error);
  }
  return result;
}

export async function updateJobsite(
  {
    id,
    type = null,
    address = null,
    name = null,
    supervisorId = null,
    description = null,

    defaultWorkStartTime = null,
    defaultWorkEndTime = null,
    defaultBreakStartTime = null,
    defaultBreakEndTime = null,
  }: {
    id: string;
    type?: string | null;
    address?: string | null;
    name?: string | null;
    supervisorId?: string | null;
    description?: string | null;

    defaultWorkStartTime?: string | null;
    defaultWorkEndTime?: string | null;
    defaultBreakStartTime?: string | null;
    defaultBreakEndTime?: string | null;
  }) {
  return await updateProjectRecord(
    {
      id: id.toUpperCase(),
      type,
      address,
      name,
      supervisorId,
      description,

      defaultWorkStartTime,
      defaultWorkEndTime,
      defaultBreakStartTime,
      defaultBreakEndTime,
    }
  );
}

export async function deleteJobsite(id: string) {
  const uppercaseId = id.toUpperCase();
  return await deleteProjectRecord(uppercaseId);
}



export { getJobsite } from './jobsiteServices/getJobsite.js';
export { jobsiteExists } from './jobsiteServices/jobsiteExists.ts';