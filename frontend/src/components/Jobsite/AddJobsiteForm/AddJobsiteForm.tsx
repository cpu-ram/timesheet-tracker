import { useEffect } from 'react';
import React, { useState } from 'react';
import { Grid, TextField, Box, Button, Typography } from '@mui/material';
import Navigation from '../../Navigation/Navigation.tsx';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { JOBSITE_ID_MAX_LENGTH } from '../../../utils/validation/jobsiteValidation.ts';

import { Temporal } from '@js-temporal/polyfill';
import { convertDateToPlainTime, convertPlainTimeToDate } from '../../../utils/temporalFunctions.ts';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AddJobsiteFormProps } from './types.ts';
import { initializeFormData, validateTimes } from './utils.ts';

import { FormStructure } from './types.ts';
import TextEntryFieldFactory from './TextEntryFieldFactory.tsx';
import { JobsiteFieldValue } from '../JobsiteFieldValue.tsx';
import { JobsiteProps } from '../types.ts';

import {
  useErrorWrapperStyle, useErrorTextStyle, useSpacerBlockStyle, useSubmitButtonStyle, useDiscardButtonStyle,
  useAddJobsiteFormWrapperStyle,
  useEntryFieldColumnStyle,
} from './styles.ts';
import { useFieldTitleStyle } from '../../shared/styles/recordStyles.ts';

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
        jobsiteDescription: jobsite.jobsiteDescription ?? '',
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
    if (validationError && validateTimes({ startTime: formData.defaultWorkStartTime, endTime: formData.defaultWorkEndTime })) {
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
      [name]:
        name === 'jobsiteId' ? value.toUpperCase() : value
    }));
  };

  const handleTimeChange =
    (key: 'defaultWorkStartTime' | 'defaultWorkEndTime') => (date: Date) => {
      if (!date || isNaN(date.getTime())) return;
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
            error.status === 409 ?
              'Jobsite with this ID already exists. Please choose a different ID.' :
              'API error: ' + error.message :
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
    // { name: 'supervisorName', label: 'Supervisor' }
  ];

  const textEntryFieldFactory = new TextEntryFieldFactory({
    handleInputChange,
    formStructure: textFieldsStructure,
    formData
  });

  return (

    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Box name="addJobsiteFormRootWrapper"
          sx={{
            ...useAddJobsiteFormWrapperStyle,
            borderRadius: '4px',
            backgroundColor: 'transparent',
            '& > div > form > div+div': {
              marginTop: '0.57em',
            },
          }}
        >

          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '0.5em',
              border: `1px solid ${theme.palette.divider}`,
              '& input, .entry-field, textarea, .MuiOutlinedInput-root': {
                backgroundColor: `${theme.palette.grey[100]} !important`,
              },
              '& > div': {
                padding: '0.5em 0',
              },
              '& .entry-field, .entry-field > div': {
                backgroundColor: 'transparent',
              },


              '& .MuiInputAdornment-root .MuiIconButton-root': {
                backgroundColor: `${theme.palette.grey[100]} !important`,
                borderRadius: '50%',
                padding: '4px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: `${theme.palette.grey[200]} !important`,
                },
                '& .MuiTouchRipple-root': {
                  display: 'none',
                },
              }

            }}
          >

            {validationError && (
              <Box sx={useErrorWrapperStyle}>
                {validationError && <Typography sx={useErrorTextStyle}>{validationError}</Typography>}
              </Box>
            )}
            {
              mode === 'edit' && (
                <Box sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0.5em 0 1em 0.56em !important',
                }}>
                  <Typography
                    component="span" sx={useFieldTitleStyle}
                    sx={{
                      display: 'inline-block',
                      width: '7.5em',
                      fontStyle: 'italic',
                    }}
                  >
                    ID
                  </Typography>
                  <JobsiteFieldValue isExpected>
                    {jobsite?.jobsiteId ?? null}
                  </JobsiteFieldValue>
                </Box>
              )
            }
            {
              mode === 'add' && (
                <>
                  {textEntryFieldFactory.createField({
                    name: 'jobsiteId', required: true, gridWidth: 4.5, disabled: mode === 'edit',
                    maxLength: JOBSITE_ID_MAX_LENGTH,
                  })}
                </>
              )
            }

            {textEntryFieldFactory.createField({ name: 'jobsiteName', gridWidth: 7.5 })}
            {textEntryFieldFactory.createField({ name: 'jobsiteAddress', gridWidth: 12 })}
            {textEntryFieldFactory.createField({ name: 'jobsiteDescription', gridWidth: 12 })}
            {
              // textEntryFieldFactory.createField({ name: 'supervisorName', gridWidth: 6.7 })
            }


            <DesktopTimePicker
              label="Typical start"
              value={formData.defaultWorkStartTime ? convertPlainTimeToDate(formData.defaultWorkStartTime) : null}
              onChange={handleTimeChange('defaultWorkStartTime')}
              onBlur={handleTimeChange('defaultWorkStartTime')}
              fullWidth
              sx={{
                marginRight: '0.5em',
              }}

            />

            <DesktopTimePicker
              label="Typical end"
              name="endTime"

              value={formData.defaultWorkEndTime ? convertPlainTimeToDate(formData.defaultWorkEndTime) : null}
              onChange={handleTimeChange('defaultWorkEndTime')}
              onBlur={handleTimeChange('defaultWorkEndTime')}
              fullWidth
            />



          </Box>


          <Box
            name="buttonsWrapper"
            sx={{
              width: '100%',

              display: 'flex',
              flexDirection: 'row',
              gap: '0.75em',

              marginTop: '0.3em',
              padding: '0.5em',

              justifyContent: {
                xs: 'flex-end',
                sm: 'flex-start',
              }
            }}
          >

            <Button
              variant='contained'
              onClick={handleDiscard}
              value="Discard"
              sx={{
                ...useDiscardButtonStyle,
                color: 'black',
                backgroundColor: 'white',
                border: '1.3px solid #777',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  border: '1.3px solid #555',
                }
              }}
            >
              {discardLabel}
            </Button>

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

          </Box>

        </Box >
      </form>
    </LocalizationProvider >
  );
};

export default AddJobsiteForm;