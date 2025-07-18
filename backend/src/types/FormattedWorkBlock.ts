interface FormattedWorkBlock {
  jobsiteId: string;
  date: string;
  workBlockStart: string;
  workBlockEnd: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  hours: number;
  jobsiteDetails: string;
}

export { FormattedWorkBlock };
