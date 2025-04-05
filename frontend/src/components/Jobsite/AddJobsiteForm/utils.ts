import { Temporal } from '@js-temporal/polyfill';

export function initializeFormData(
  jobsiteId = null,
  jobsiteAddress = null,
  jobsiteName = null,
  description = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  supervisorName = null,
): {
  jobsiteId: string;
  jobsiteAddress: string;
  jobsiteName: string;
  description: string;
  supervisorName: string | null;
} {
  return ({
    jobsiteId: jobsiteId ?? null,
    jobsiteAddress: jobsiteAddress ?? null,
    jobsiteName: jobsiteName ?? null,
    description: description ?? null,
    supervisorName: supervisorName ?? null,
    defaultWorkStartTime: defaultWorkStartTime ?? null,
    defaultWorkEndTime: defaultWorkEndTime ?? null,
  });
}

export function validateTimes(
  { startTime, endTime, }: {
    startTime: Temporal.PlainTime | null;
    endTime: Temporal.PlainTime | null;
  })
  : boolean {
  if (startTime && endTime) {
    return Temporal.PlainTime.compare(startTime, endTime) === -1;
  }
  return true;
}