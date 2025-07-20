import { Temporal } from '@js-temporal/polyfill';

export function initializeFormData(
  jobsiteId = null,
  jobsiteAddress = null,
  jobsiteName = null,
  jobsiteDescription = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  supervisorName = null,
): {
  jobsiteId: string | null;
  jobsiteAddress: string | null;
  jobsiteName: string | null;
  jobsiteDescription: string | null;
  supervisorName: string | null;
  defaultWorkStartTime: Temporal.PlainTime | null;
  defaultWorkEndTime: Temporal.PlainTime | null;
} {
  return ({
    jobsiteId: jobsiteId ?? null,
    jobsiteAddress: jobsiteAddress ?? null,
    jobsiteName: jobsiteName ?? null,
    jobsiteDescription: jobsiteDescription ?? null,
    supervisorName: supervisorName ?? null,
    defaultWorkStartTime: defaultWorkStartTime ?? null,
    defaultWorkEndTime: defaultWorkEndTime ?? null,
  });
}

export function validateTimes(
  {
    startTime, endTime,
  }: {
    startTime: Temporal.PlainTime | null;
    endTime: Temporal.PlainTime | null;
  })
  : boolean {
  if (startTime && endTime) {
    return Temporal.PlainTime.compare(startTime, endTime) === -1;
  }
  return true;
}
