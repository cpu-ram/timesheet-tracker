import Box from '@mui/material/Box';
import { WorkBlockEntryForm } from '../WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';

export const AddWorkBlockFormContainer = () => {
  return (
    <Box>
      <WorkBlockEntryForm
        mode="add"
      />
    </Box>
  );
};
