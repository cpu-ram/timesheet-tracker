import { JobsiteProps } from '../components/Jobsite/types.ts';
import { Temporal } from '@js-temporal/polyfill';

import { ApiError } from '../errors/ApiError.ts';

export const fetchJobsite = async ({ jobsiteId }: { jobsiteId: String }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = `/jobsites`;

  try {
    const response = await fetch(`${baseUrl}${timesheetDataSubPath}/${jobsiteId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Failed to fetch jobsite data:') + response.statusText;
      throw new Error('Failed to fetch jobsite data');
    }
    const data = await response.json();
    const parsedData = data
      ? {
          ...data,
          defaultWorkStartTime: data.defaultWorkStartTime
            ? Temporal.PlainTime.from(data.defaultWorkStartTime)
            : null,
          defaultWorkEndTime: data.defaultWorkEndTime
            ? Temporal.PlainTime.from(data.defaultWorkEndTime)
            : null,
        }
      : null;
    return parsedData;
  } catch (error) {
    console.error('Error fetching jobsite data:', error);
    throw error;
  }
};

export const fetchJobsitePreviews = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = `/jobsites/previews/`;

  try {
    const response = await fetch(`${baseUrl}${timesheetDataSubPath}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Failed to fetch jobsite previews:') + response.statusText;
      throw new Error('Failed to fetch jobsite previews');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobsite previews:', error);
    throw error;
  }
};

export const createJobsite = async (jobsiteProps: JobsiteProps) => {
  const {
    jobsiteId,
    jobsiteName,
    jobsiteAddress,
    jobsiteDescription,
    supervisorName,
    defaultWorkStartTime,
    defaultWorkEndTime,
  } = jobsiteProps;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = `/jobsites`;

  const response = await fetch(`${baseUrl}${timesheetDataSubPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: jobsiteId,
      name: jobsiteName,
      address: jobsiteAddress,
      description: jobsiteDescription,
      supervisorName,
      defaultWorkStartTime: defaultWorkStartTime?.toString({ smallestUnit: 'minute' }),
      defaultWorkEndTime: defaultWorkEndTime?.toString({ smallestUnit: 'minute' }),
    }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    const error = new ApiError(response.status, responseData.message);
    throw error;
  }
  return responseData;
};

export const updateJobsite = async ({
  jobsiteData,
  onSuccess,
}: {
  jobsiteData: JobsiteProps;
  onSuccess?: (data: any) => void;
}) => {
  const {
    jobsiteId,
    jobsiteName,
    jobsiteAddress,
    jobsiteDescription,
    supervisorName,
    defaultWorkStartTime,
    defaultWorkEndTime,
  } = jobsiteData;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = `/jobsites/${jobsiteId}`;

  const response = await fetch(`${baseUrl}${timesheetDataSubPath}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      id: jobsiteId,
      name: jobsiteName,
      address: jobsiteAddress,
      description: jobsiteDescription,
      supervisorName: supervisorName,
      defaultWorkStartTime: defaultWorkStartTime?.toString({ smallestUnit: 'minute' }),
      defaultWorkEndTime: defaultWorkEndTime?.toString({ smallestUnit: 'minute' }),
    }),
  });
  const responseData = await response.json();

  for (let field of ['defaultWorkStartTime', 'defaultWorkEndTime']) {
    if (responseData[field]) {
      responseData[field] = Temporal.PlainTime.from(responseData[field]);
    }
  }

  if (!response.ok) {
    const error = new ApiError(response.status, responseData.message);
    throw error;
  }
  onSuccess?.(responseData);
  return responseData;
};

export const deleteJobsite = async (id: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const timesheetDataSubPath = `/jobsites`;

  try {
    const response = await fetch(`${baseUrl}${timesheetDataSubPath}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Failed to delete jobsite:') + response.statusText;
      throw new Error('Failed to delete jobsite');
    }
    return responseData;
  } catch (error) {
    console.error('Error deleting jobsite:', error);
    throw error;
  }
};
