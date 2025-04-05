import { Temporal } from '@js-temporal/polyfill';

export interface JobsiteProps {
  defaultWorkStartTime?: Temporal.PlainTime | null;
  defaultWorkEndTime?: Temporal.PlainTime | null;
  jobsiteId?: string | null;
  supervisorName?: string | null;
  jobsiteAddress?: string | null;
  jobsiteName?: string | null;
  description?: string | null;
}
