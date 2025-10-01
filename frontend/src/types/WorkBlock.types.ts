import { Temporal } from '@js-temporal/polyfill';

export interface WorkBlockData {
  workBlockId?: number ;
  workBlockStart?: Temporal.PlainTime | null;
  workBlockEnd?: Temporal.PlainTime | null;
  breakStart?: Temporal.PlainTime | null;
  breakEnd?: Temporal.PlainTime | null;
  jobsiteId?: string | null;
  jobsiteAddress?: string | null;
  jobsiteName?: string | null;
  supervisorName?: string | null;
  additionalNotes?: string | null;

  date?: Temporal.PlainDate;
}

export interface WorkBlockHandlers {
  handleSelectForEdit?: (workBlockId: number) => void;
}

export interface WorkBlockFlags {
  showActions?: boolean;
  expandable?: boolean;
  compact?: boolean;
}

export type WorkBlockProps = WorkBlockData & WorkBlockHandlers & WorkBlockFlags;

export interface WorkBlockEntryFormProps {
  workBlockData?: WorkBlockData;
  mode: 'add' | 'edit';

  onEnteredData?: ({
    workBlockData,
    onJobsiteCreated,
  }: {
    workBlockData: WorkBlockData;
    onJobsiteCreated?: (jobsiteId: string) => void;
  }) => void;
  onError?: (error: Error) => void;
  onDiscard?: () => void;

  onSaved?: () => void;

}
