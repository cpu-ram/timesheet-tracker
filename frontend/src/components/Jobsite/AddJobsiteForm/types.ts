import { Temporal } from '@js-temporal/polyfill';
import { JobsiteProps } from '../types.ts';

export interface AddJobsiteFormProps {
  jobsite: JobsiteProps;
  handleEnteredData: (data: any) => void;
  handleDiscard: () => void;
  mode: 'add' | 'edit';
}

type FormField = {
  name: string,
  label: string,
}

export type FormStructure = FormField[];