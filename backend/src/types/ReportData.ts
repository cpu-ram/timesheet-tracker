import { FormattedWorkBlock } from './FormattedWorkBlock.js';

interface ReportData {
  fullName: string;
  weekStartDate: string;
  weekEndDate: string;
  currentDate: string;
  totalHours: number,
  regularHours: number;
  overTimeHours: number;
  workBlocks: FormattedWorkBlock[];
}

export {ReportData};
