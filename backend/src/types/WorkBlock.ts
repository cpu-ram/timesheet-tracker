import { Temporal } from '@js-temporal/polyfill';

interface WorkBlock {
  jobsiteId: string | null;
  date: Temporal.PlainDate | null;
  workBlockStart: Temporal.PlainTime | null;
  workBlockEnd: Temporal.PlainTime | null;
  breakStart: Temporal.PlainTime | null;
  breakEnd: Temporal.PlainTime | null;
  jobsiteName: string | null;
  jobsiteAddress: string | null;
}

export {WorkBlock};
