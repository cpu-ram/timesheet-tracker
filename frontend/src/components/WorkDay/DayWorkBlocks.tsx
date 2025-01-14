import { useState } from 'react';

import { IconButton, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Typography, Box } from '@mui/material';
import { WorkBlock } from '../WorkBlock.tsx';

const DayWorkBlocks = ({ workData }) => {
  const theme = useTheme();

  const [editMode, setEditMode] = useState(false);

  const handleSetEditMode = () => {
    setEditMode(true);
  }

  const handleCancelEdit = () => {
    setEditMode(false);
  }

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='left'>
        <Typography variant='h6' sx={{ pt: 1, pb: 1 }}>
          Work Day data
        </Typography>

        {
          editMode ?
            (
              <>
                <Button>
                  Save
                </Button>

                <Button
                  onClick={() => handleCancelEdit()}
                  sx={{ color: theme.palette.error.light }}
                >
                  Cancel
                </Button>
              </>
            )
            :
            (
              <IconButton onClick={() => handleSetEditMode()}>
                <EditIcon sx={{ color: editMode ? 'grey' : theme.palette.primary.dark }} />
              </IconButton>
            )
        }

      </Box >
      {
        workData ?
          (
            workData.map((workBlock) => (
              workBlock ?
                <WorkBlock {...workBlock} editMode={editMode} key={workBlock.workBlockId} />
                :
                null
            ))
          )
          :
          (
            <Typography key='no-records' sx={{ fontStyle: 'italic' }}>
              No work records available for the selected day
            </Typography>
          )
      }
    </>
  );
}

export default DayWorkBlocks;