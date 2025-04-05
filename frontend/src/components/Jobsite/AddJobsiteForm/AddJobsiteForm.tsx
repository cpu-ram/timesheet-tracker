import { useEffect } from 'react';
import React, { useState } from 'react';
import { Grid, TextField, Box, Button, Typography } from '@mui/material';
import Navigation from '../../Navigation/Navigation.tsx';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Temporal } from '@js-temporal/polyfill';
import { convertDateToPlainTime, convertPlainTimeToDate } from '../../../utils/temporalFunctions.ts';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AddJobsiteFormProps } from './types.ts';
import { initializeFormData, validateTimes } from './utils.ts';

import { FormStructure } from './types.ts';
import TextEntryFieldFactory from './TextEntryFieldFactory.tsx';
import { JobsiteProps } from '../types.ts';

import {
  useErrorWrapperStyle, useErrorTextStyle, useSpacerBlockStyle, useSubmitButtonStyle, useDiscardButtonStyle,
  useAddJobsiteFormWrapperStyle,
  useEntryFieldColumnStyle,
} from './styles.ts';

import { ApiError } from '../../../errors/ApiError.ts';

const AddJobsiteForm = ({
  jobsite, handleEnteredData, handleDiscard, mode, setMode
}: AddJobsiteFormProps) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState(() =>
    jobsite
      ? {
        jobsiteId: jobsite.jobsiteId ?? '',
        jobsiteName: jobsite.jobsiteName ?? '',
        jobsiteAddress: jobsite.jobsiteAddress ?? '',
        jobsiteDescription: jobsite.description ?? '',
        supervisorName: jobsite.supervisorName ?? '',
        defaultWorkStartTime: jobsite.defaultWorkStartTime ?? null,
        defaultWorkEndTime: jobsite.defaultWorkEndTime ?? null,
      }
      : initializeFormData()
  );
  const [validationError, setValidationError] = useState(null);

  const [saveLabel, discardLabel] = (() => {
    if (mode === 'add') { return ['Add', 'Discard']; }
    if (mode === 'edit') return ['Save', 'Cancel'];

    throw new Error('Invalid mode: mode must be either "add" or "edit".');
  })();

  useEffect(() => {
    if (validationError && validateTimes(formData.defaultWorkStartTime, formData.defaultWorkEndTime)) {
      setValidationError(null);
    }
  }, [formData.defaultWorkStartTime, formData.defaultWorkEndTime]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (validationError && validateTimes({ startTime: formData.defaultWorkStartTime, endTime: formData.defaultWorkEndTime })) {
      setValidationError(null);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTimeChange =
    (key: 'defaultWorkStartTime' | 'defaultWorkEndTime') => (date: Date) => {
      if (isNaN(date.getTime())) return;
      if (validationError && validateTimes(formData.defaultWorkStartTime, formData.defaultWorkEndTime)) {
        setValidationError(null);
      }

      setFormData((prevData) => ({
        ...prevData,
        [key]: convertDateToPlainTime(date),
      }));

    }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateTimes({ startTime: formData.defaultWorkStartTime, endTime: formData.defaultWorkEndTime })) {
      if (validationError !== null) setValidationError(null);
      try {
        await handleEnteredData(formData);
        if (mode === 'add') navigate('/jobsites');
        if (mode === 'edit') {
          setMode('view');
        }
      }
      catch (error) {
        console.error('Error while creating jobsite:', error);
        setValidationError(
          (error instanceof ApiError) ?
            error.status :
            'An unexpected error occurred. Please try again.'
        );
      }
    }
    else {
      const validationErrorString = "Error: end time must be after start time";
      setValidationError(validationErrorString);
    }
  };


  const theme = useTheme();

  const textFieldsStructure: FormStructure = [
    { name: 'jobsiteId', label: 'ID' },
    { name: 'jobsiteName', label: 'Name' },
    { name: 'jobsiteAddress', label: 'Address' },
    { name: 'jobsiteDescription', label: 'Description' },
    { name: 'supervisorName', label: 'Supervisor' }
  ];

  const textEntryFieldFactory = new TextEntryFieldFactory({
    handleInputChange,
    formStructure: textFieldsStructure,
    formData
  });

  return (

    <LocalizationProvider dateAdapter={AdapterDateFns}>

      <Box name="addJobsiteRootWrapper" sx={useAddJobsiteFormWrapperStyle}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            {validationError && (
              <Box sx={useErrorWrapperStyle}>
                {validationError && <Typography sx={useErrorTextStyle}>{validationError}</Typography>}
              </Box>
            )}

            <Box sx={useSpacerBlockStyle}></Box>

            {textEntryFieldFactory.createField({ name: 'jobsiteId', required: true, gridWidth: 4 })}
            {textEntryFieldFactory.createField({ name: 'jobsiteName', gridWidth: 8 })}
            {textEntryFieldFactory.createField({ name: 'jobsiteAddress', gridWidth: 12 })}
            <Box sx={useSpacerBlockStyle}></Box>
            {textEntryFieldFactory.createField({ name: 'jobsiteDescription', gridWidth: 12 })}


            <Grid item sx={useEntryFieldColumnStyle()} xs={5.3}>
              <DesktopTimePicker
                label="Normal start"
                name="startTime"
                value={formData.defaultWorkStartTime ? convertPlainTimeToDate(formData.defaultWorkStartTime) : null}
                onChange={handleTimeChange('defaultWorkStartTime')}
                onBlur={handleTimeChange('defaultWorkStartTime')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 600, // 10 minutes
                }}
                fullWidth
              />

              <DesktopTimePicker
                label="Normal end"
                name="endTime"
                value={formData.defaultWorkEndTime ? convertPlainTimeToDate(formData.defaultWorkEndTime) : null}
                onChange={handleTimeChange('defaultWorkEndTime')}
                onBlur={handleTimeChange('defaultWorkEndTime')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 600,
                }}
                fullWidth
              />
            </Grid>
            {textEntryFieldFactory.createField({ name: 'supervisorName', gridWidth: 6.7 })}

            <Box sx={useSpacerBlockStyle}></Box>


            <Grid item>
              <Button
                variant="contained"
                type="submit"
                value="Save"
                sx={
                  useSubmitButtonStyle(validationError)
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
                sx={useDiscardButtonStyle}
              >
                {discardLabel}
              </Button>
            </Grid>


          </Grid>
        </form>
      </Box >
    </LocalizationProvider>
  );
};

export default AddJobsiteForm;