export interface WorkBlockProps = {
  workBlockId ?: string;
  workBlockStart ?: Temporal.PlainTime | null;
  workBlockEnd ?: Temporal.PlainTime | null;
  jobsiteId ?: string;
  jobsiteAddress ?: string;
  jobsiteName ?: string;
  supervisorName ?: string;
  additionalNotes ?: string;
}

export interface AddWorkBlockFormFlags {
  mode?: 'add' | 'edit';
  multiDaySelectionMode?: boolean;
}

export type AddWorkBlockFormProps =
  {
    workBlockProps: WorkBlockProps;
    formFlags: AddWorkBlockFormFlags;
    handlers?: {
      handleEnteredData?: (data: WorkBlockProps) => void;
    }
    suggestedWorkBlockProps?: WorkBlockProps;
  }