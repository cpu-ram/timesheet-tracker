import { Temporal } from '@js-temporal/polyfill';

export interface WorkBlockData {
  workBlockId?: number;
  workBlockStart?: Temporal.PlainTime | null;
  workBlockEnd?: Temporal.PlainTime | null;
  breakStart?: Temporal.PlainTime | null;
  breakEnd?: Temporal.PlainTime | null;
  jobsiteId?: string | null;
  jobsiteAddress?: string | null;
  jobsiteName?: string | null;
  supervisorName?: string | null;
  additionalNotes?: string | null;
}

export interface WorkBlockHandlers {
  handleDeleteWorkBlock?: (workBlockId: number) => void;
  handleSelectForEdit?: (workBlockId: number) => void;
}

export interface WorkBlockFlags {
  editMode?: boolean;
}

export type WorkBlockProps = WorkBlockData & WorkBlockHandlers & WorkBlockFlags;


export interface AddWorkBlockFormFlags {
  mode?: 'add' | 'edit';
  multiDaySelectionMode?: boolean;
}


export interface WorkBlockSubmitHandler {
  handleEnteredData: (
    {
      workBlockData,
      onJobsiteCreated
    }: {
      workBlockData: WorkBlockData;
      onJobsiteCreated?: (jobsiteId: string) => void;
    }) => void;
  onError?: (error: Error) => void;
}

export interface AddWorkBlockFormProps {
  workBlockData?: WorkBlockData;
  formFlags: AddWorkBlockFormFlags;
  handlers?: WorkBlockSubmitHandler;
  suggestedWorkBlockData?: WorkBlockData;
}
