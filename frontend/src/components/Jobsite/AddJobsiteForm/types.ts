import { JobsiteProps } from '../types.ts';

export interface AddJobsiteFormProps {
  jobsite: JobsiteProps | null;
  handleEnteredData: (data: any) => void;
  handleDiscard: () => void;
  mode: 'add' | 'edit';
  setMode: (mode: 'add' | 'edit' | 'view') => void;
}

type FormField = {
  name: string,
  label: string,
}

export type FormStructure = FormField[];
