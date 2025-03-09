import { useEffect } from 'react';
import React, { useState } from 'react';
import { Grid, TextField, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Temporal } from '@js-temporal/polyfill';
import { convertDateToPlainTime, convertPlainTimeToDate } from '../utils/temporalFunctions';

import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AddWorkBlockForm = ({
  workBlockStart = null, workBlockEnd = null, jobsiteId = null, supervisorName = null, jobsiteAddress = null,
  jobsiteName = null, additionalNotes = null, handleEnteredData, handleDiscard, mode = null,
  multiDaySelectionMode = false, dateSelectionHandler,
}) => {
  const initializeFormData = () => ({
    workBlockStart: workBlockStart ? workBlockStart : '',
    workBlockEnd: workBlockEnd ? workBlockEnd : '',
    jobsiteId: jobsiteId ?? null,
    supervisorName: supervisorName ?? null,
    jobsiteAddress: jobsiteAddress ?? null,
    jobsiteName: jobsiteName ?? null,
    additionalNotes: additionalNotes ?? null
  });

  const [formData, setFormData] = useState(initializeFormData());
  const [validationError, setValidationError] = useState(null);

  const [saveLabel, discardLabel] = (() => {
    if (mode === 'add') { return ['Add', 'Discard']; }
    if (mode === 'edit') return ['Save', 'Cancel'];

    throw new Exception();
  })();

  useEffect(() => {
    setFormData(
      initializeFormData()
    );
  }, [workBlockStart, workBlockEnd, jobsiteId, supervisorName, jobsiteAddress, jobsiteName, additionalNotes]);

  useEffect(() => {
    if (validationError && validateTimes()) {
      setValidationError(null);
    }
  }, [formData.workBlockStart, formData.workBlockEnd]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (validationError && validateTimes()) {
      setValidationError(null);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartTimeChange = (date: Date) => {
    if (isNaN(date.getTime())) return;
    if (validationError && validateTimes()) {
      setValidationError(null);
    }

    setFormData((prevData) => ({
      ...prevData,
      workBlockStart: convertDateToPlainTime(date),
    }));
  };

  const handleEndTimeChange = (date: Date) => {
    if (isNaN(date.getTime())) return;
    if (validationError && validateTimes()) {
      setValidationError(null);
    }

    setFormData((prevData) => ({
      ...prevData,
      workBlockEnd: convertDateToPlainTime(date),
    }));
  };

  const validateTimes = () => {
    if (!!formData.workBlockStart && !!formData.workBlockEnd) {
      if (Temporal.PlainTime.compare(formData.workBlockStart, formData.workBlockEnd) !== -1) {
        return false;
      }
    }
    return true;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateTimes()) {
      if (validationError !== null) setValidationError(null);
      handleEnteredData(formData);
      handleDiscard();
    }
    else {
      const validationErrorString = "Error: end time must be after start time";
      setValidationError(validationErrorString);
    }
  };

  const handleSelectMultiDaySelectionMode = () => {
    dateSelectionHandler.switch();
  }

  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>

      <Box
        sx={{
          padding: '1.5 0 0 1',
          maxWidth: '45em',
        }}
      >
        <Grid container spacing={1}>
          {validationError && (
            <Box sx={{
              padding: 0,
              margin: 0,
              paddingBottom: 1,
              paddingLeft: 1.5,
            }}>
              {validationError && <Typography sx={{ color: 'red' }}>{validationError}</Typography>}
            </Box>
          )}
          <Grid item xs={6}>
            <DesktopTimePicker
              label="Start Time"
              name="startTime"
              value={formData.workBlockStart ? convertPlainTimeToDate(formData.workBlockStart) : null}
              onChange={handleStartTimeChange}
              onBlur={handleStartTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 600, // 10 minutes
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <DesktopTimePicker
              label="End Time"
              name="endTime"
              value={formData.workBlockEnd ? convertPlainTimeToDate(formData.workBlockEnd) : null}
              onChange={handleEndTimeChange}
              onBlur={handleEndTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 600, // 10 minutes
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} style={{ padding: 0 }}>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Jobsite ID"
              name="jobsiteId"
              value={formData.jobsiteId ?? ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Jobsite Name"
              name="jobsiteName"
              value={formData.jobsiteName ?? ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>
          <Grid item xs={7.5}>
            <TextField
              label="Address"
              name="jobsiteAddress"
              value={formData.jobsiteAddress ?? ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>
          <Grid item xs={4.5}>
            <TextField
              label="Supervisor"
              name="supervisorName"
              value={formData.supervisorName ?? ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Additional notes"
              name="additionalNotes"
              value={formData.additionalNotes ?? ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              onClick={handleSubmit}
              value="Save"
              sx={
                validationError ? {
                  backgroundColor: theme.palette.warning.dark,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: theme.palette.warning.dark
                  }
                } : {
                  backgroundColor: theme.palette.primary.dark,
                  color: 'white',
                }
              }
            >
              {saveLabel}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant='contained'
              onClick={handleDiscard}
              value="Discard"
              sx={{
                backgroundColor: "#e2e3e5",
                color: "#3c4043",
                "&:hover": {
                  backgroundColor: "#d6d8db"
                },
              }}
            >
              {discardLabel}
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant='contained'
              sx={
                multiDaySelectionMode ?
                  {
                    backgroundColor: theme.palette.warning.light,
                    color: 'black',
                  }
                  :
                  {
                    backgroundColor: "#e2e3e5",
                    color: '#3c4043',
                  }
              }
              onClick={handleSelectMultiDaySelectionMode}
            >
              {multiDaySelectionMode ? 'Duplicate off' : 'Duplicate'}
            </Button>
          </Grid>
        </Grid>
      </Box >
    </LocalizationProvider>
  );
};

export default AddWorkBlockForm;