import { Button, Typography, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CompressIcon from '@mui/icons-material/Compress';
import React from 'react';

import { useState, useEffect } from 'react';
import { QueryStatsTwoTone } from '@mui/icons-material';

import { SearchMatchMarkedText } from './SearchMatchMarkedText';

import { useTimesheetContext } from '../../contexts/TimesheetContext.tsx';
import { useStyleContext } from '../../contexts/StyleContext.tsx';

export default function Buttons({
  editMode, addMode,
  handleSetAddMode, handleSetEditMode, handleDiscard,
  handleCancelEdit,
  currentDayWorkData
}) {

  const { theme } = useStyleContext();
  const [jobsiteSearchQuery, setJobsiteSearchQuery] = useState('');

  useEffect(() => {
    handleDiscard();
  }, []);

  return (
    <Grid name='buttons'
      container
      spacing={0}
      item
      xs={12}
      sx={{
        display: addMode ? 'none' : 'flex',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',

        gap: 1,
        padding: '1em 0.5em 1em',

        borderBottom: `0px solid ${theme.palette.divider}`,
      }}>

      {
        (editMode && addMode) ?
          <Typography> Error</Typography>
          :
          <></>
      }

      {
        !addMode && !editMode ?
          <Grid item
            sx={{
              display: 'flex',
              gap: 1,
              padding: 0,
              margin: 0,
            }}>
            <Button
              display='flex'
              onClick={() => handleSetAddMode()}
              variant='outlined'
              sx={{
                backgroundColor: 'white',
                color: 'black',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              }}>
              <AddIcon />
            </Button>

            {
              (currentDayWorkData != null && currentDayWorkData.length > 0) &&
              <Button
                onClick={() => handleSetEditMode()}
                variant='outlined'
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                <EditIcon />
              </Button>
            }

          </Grid>
          :
          <></>
      }


      {
        editMode ?
          <Button
            onClick={() => handleCancelEdit()}
            sx={{
              color: 'white',
              backgroundColor: theme.palette.info.dark
            }}
            variant='outlined'
          >
            <Typography variant='h7' sx={{
              padding: 0,
              margin: 0,
            }}>
              Done
            </Typography>
          </Button>
          :
          <></>
      }
    </Grid >
  );
}