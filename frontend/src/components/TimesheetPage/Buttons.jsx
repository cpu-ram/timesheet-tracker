import { Button, Typography, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CompressIcon from '@mui/icons-material/Compress';
import React from 'react';

export default function Buttons({
  theme,
  editMode, addMode,
  handleSetAddMode, handleSetEditMode, handleDiscard,
  handleSearchJobsites, handleFetchJobsiteData, handleCancelEdit, jobsiteSearchResults,
  currentDayWorkData
}) {
  return (
    <Grid name='buttons'
      container
      spacing={0}
      item
      xs={12}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',

        gap: 1,
        paddingTop: 1,
        paddingLeft: 0,
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
                backgroundColor: theme.palette.primary.light,
                color: 'white',
              }}>
              <AddIcon />
            </Button>

            {
              (currentDayWorkData != null && currentDayWorkData.length > 0) &&
              <Button
                display='flex'
                onClick={() => handleSetEditMode()}
                variant='outlined'
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: 'white'
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
        addMode ?
          <Box
            xs={12}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              gap: 1,
              padding: 0,
              margin: 0,
            }}>
            <Box
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: 1,
                paddingRight: 2,
                gap: 1,
              }}
              spacing={2}
            >
              <Button
                onClick={() => handleDiscard()}
                variant='outlined'
                display='flex'
                sx={{
                  backgroundColor: theme.palette.info.dark,
                  color: 'white',
                  margin: 0,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                <CompressIcon />
              </Button>

              <Autocomplete
                options={jobsiteSearchResults}
                getOptionLabel={
                  (option) => {
                    return Object.entries(option).map(([key, value]) => {
                      if (value != null) {
                        return (`${key}: ${value}`);
                      }
                    }
                    ).filter((x) => (x != null)).join(', ');
                  }}
                onInputChange={handleSearchJobsites}
                onChange={handleFetchJobsiteData}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    label="Search Jobsites"
                    fullWidth
                    sx={{ fontSize: '16px' }}
                  />
                }
                sx={{
                  flexGrow: 1,
                  minWidth: 0,
                  fontSize: '16px',
                }}
              />

            </Box>
          </Box>
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