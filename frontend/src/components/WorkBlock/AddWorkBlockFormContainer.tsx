
import { Box } from '@mui/system';
import { WorkBlockEntryForm } from '../WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';

export const AddWorkBlockFormContainer = () => {
  return (
    <Box>
      <WorkBlockEntryForm
        formFlags={{
          mode: 'add',
        }}
      />
    </Box>
  );
};