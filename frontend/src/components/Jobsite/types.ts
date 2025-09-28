import { Temporal } from '@js-temporal/polyfill';

export interface JobsiteProps {
  jobsiteId?: string | null;
  jobsiteName?: string | null;
  jobsiteAddress?: string | null;
  jobsiteDescription?: string | null;
  supervisorName?: string | null;
  defaultWorkStartTime?: Temporal.PlainTime | null;
  defaultWorkEndTime?: Temporal.PlainTime | null;

  showJobsiteId?: boolean;
}
