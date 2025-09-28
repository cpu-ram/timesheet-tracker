import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { JOBSITE_ID_MAX_LENGTH } from '../../../utils/validation/jobsiteValidation.ts';

import {
  convertDateToPlainTime,
  convertPlainTimeToDate,
} from '../../../utils/temporalFunctions.ts';
import { LocalizationProvider, DesktopTimePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { JobsiteDataEntryFormProps } from './types.ts';
import { initializeFormData, validateTimes } from './utils.ts';

import { FormStructure } from './types.ts';
import createTextEntryFieldFactory from './TextEntryFieldFactory.tsx';
import { JobsiteFieldValue } from '../JobsiteFieldValue.tsx';

import { JobsiteFieldDisplay } from '../JobsiteFieldDisplay.tsx';

import {
  getErrorWrapperStyle,
  getErrorTextStyle,
  getSubmitButtonStyle,
  getDiscardButtonStyle,
} from './styles.ts';
import { getFieldTitleStyle } from '../../shared/styles/recordStyles.ts';

import { ApiError } from '../../../errors/ApiError.ts';

const JobsiteDataEntryForm = ({
  jobsite,
  handleEnteredData,
  handleDiscard,
  mode,
  setMode,
}: JobsiteDataEntryFormProps) => {
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
      : initializeFormData(),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const [saveLabel, discardLabel] = (() => {
    if (mode === 'add') {
      return ['Add', 'Discard'];
    }
    if (mode === 'edit') return ['Save', 'Cancel'];

    throw new Error('Invalid mode: mode must be either "add" or "edit".');
  })();

  useEffect(() => {
    if (
      validationError &&
      validateTimes({
        startTime: formData.defaultWorkStartTime,
        endTime: formData.defaultWorkEndTime,
      })
    ) {
      setValidationError(null);
    }
  }, [formData.defaultWorkStartTime, formData.defaultWorkEndTime]);

  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (
      validationError &&
      validateTimes({
        startTime: formData.defaultWorkStartTime,
        endTime: formData.defaultWorkEndTime,
      })
    ) {
      setValidationError(null);
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'jobsiteId' ? value.toUpperCase() : value,
    }));
  };

  const handleTimeChange =
    (key: 'defaultWorkStartTime' | 'defaultWorkEndTime') => (date: Date | null) => {
      if (!date || isNaN(date.getTime())) return;

      const newTime = convertDateToPlainTime(date);

      const proposedFormData = {
        ...formData,
        [key]: newTime,
      };

      setFormData(prevData => ({
        ...prevData,
        [key]: newTime,
      }));

      if (
        validationError &&
        validateTimes({
          startTime: proposedFormData.defaultWorkStartTime,
          endTime: proposedFormData.defaultWorkEndTime,
        })
      ) {
        setValidationError(null);
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      validateTimes({
        startTime: formData.defaultWorkStartTime,
        endTime: formData.defaultWorkEndTime,
      })
    ) {
      if (validationError !== null) setValidationError(null);
      try {
        await handleEnteredData(formData);
        if (mode === 'add') navigate('/jobsites');
        if (mode === 'edit') {
          setMode('view');
        }
      } catch (error) {
        console.error('Error while creating jobsite:', error);
        setValidationError(
          error instanceof ApiError
            ? error.status === 409
              ? 'Jobsite with this ID already exists. Please choose a different ID.'
              : 'API error: ' + error.message
            : 'An unexpected error occurred. Please try again.',
        );
      }
    } else {
      const validationErrorString = 'Error: end time must be after start time';
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

  const textEntryFieldFactory = createTextEntryFieldFactory({
    handleInputChange,
    formStructure: textFieldsStructure,
    formData,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Box>
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '0.5em',
              border: `1px solid ${theme.palette.divider}`,
              '& .MuiInputBase-root': {
                backgroundColor: `${theme.palette.grey[100]} !important`,
              },
              '& > div': {
                padding: '0.5em 0',
              },
              '& .entry-field, .entry-field > div': {
                backgroundColor: 'transparent',
              },

              '& .MuiInputAdornment-root .MuiIconButton-root': {
                // backgroundColor: `${theme.palette.grey[100]} !important`,
                borderRadius: '50%',
                padding: '4px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: `${theme.palette.grey[200]} !important`,
                },
                '& .MuiTouchRipple-root': {
                  display: 'none',
                },
              },
            }}
          >
            {mode === 'edit' && false && (
              <JobsiteFieldDisplay title="ID" value={jobsite?.jobsiteId ?? null} />
            )}
            {mode === 'add' && false && (
              <>
                {textEntryFieldFactory.createField({
                  name: 'jobsiteId',
                  required: true,
                  maxLength: JOBSITE_ID_MAX_LENGTH,
                })}
              </>
            )}

            {validationError && (
              <Box sx={getErrorWrapperStyle}>
                {validationError && (
                  <Typography sx={getErrorTextStyle}>{validationError}</Typography>
                )}
              </Box>
            )}

            {textEntryFieldFactory.createField({ name: 'jobsiteName' })}
            {textEntryFieldFactory.createField({ name: 'jobsiteAddress' })}
            {textEntryFieldFactory.createField({ name: 'jobsiteDescription' })}

            {!isMobile ? (
              <DesktopTimePicker
                label="Typical start"
                value={
                  formData.defaultWorkStartTime
                    ? convertPlainTimeToDate(formData.defaultWorkStartTime)
                    : null
                }
                onChange={handleTimeChange('defaultWorkStartTime')}
                slotProps={{
                  textField: {
                    name: 'startTime',
                    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                      const timeEntered = new Date(event.target.value);
                      () => handleTimeChange('defaultWorkStartTime')(timeEntered);
                    },
                  },
                }}
                sx={{
                  marginRight: '0.5em',
                }}
              />
            ) : (
              <MobileTimePicker
                label="Typical start"
                value={
                  formData.defaultWorkStartTime
                    ? convertPlainTimeToDate(formData.defaultWorkStartTime)
                    : null
                }
                onChange={handleTimeChange('defaultWorkStartTime')}
                slotProps={{
                  textField: {
                    name: 'startTime',
                    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                      const timeEntered = new Date(event.target.value);
                      () => handleTimeChange('defaultWorkStartTime')(timeEntered);
                    },
                  },
                  dialog: {
                    sx: {
                      zIndex: 100000,
                    },
                  },
                }}
                sx={{
                  marginRight: '0.5em',
                }}
              />
            )}

            {!isMobile ? (
              <DesktopTimePicker
                label="Typical end"
                name="endTime"
                value={
                  formData.defaultWorkEndTime
                    ? convertPlainTimeToDate(formData.defaultWorkEndTime)
                    : null
                }
                onChange={handleTimeChange('defaultWorkEndTime')}
                slotProps={{
                  textField: {
                    name: 'endTime',
                    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                      const timeEntered = new Date(event.target.value);
                      () => handleTimeChange('defaultWorkEndTime')(timeEntered);
                    },
                  },
                }}
              />
            ) : (
              <MobileTimePicker
                label="Typical end"
                name="endTime"
                value={
                  formData.defaultWorkEndTime
                    ? convertPlainTimeToDate(formData.defaultWorkEndTime)
                    : null
                }
                onChange={handleTimeChange('defaultWorkEndTime')}
                slotProps={{
                  textField: {
                    name: 'endTime',
                    onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                      const timeEntered = new Date(event.target.value);
                      () => handleTimeChange('defaultWorkEndTime')(timeEntered);
                    },
                  },
                  dialog: {
                    sx: {
                      zIndex: 100000,
                    },
                  },
                }}
                sx={{}}
              />
            )}
          </Box>



          <Box
            id="buttonsWrapper"
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
              },
            }}
          >
            <Button
              variant="contained"
              type="button"
              onClick={handleDiscard}
              disableRipple
              disableFocusRipple
              disableElevation
              sx={{
                ...getDiscardButtonStyle(),
                color: 'black',
                backgroundColor: 'white',
                border: '1.3px solid #777',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  border: '1.3px solid #555',
                },
              }}
            >
              {discardLabel}
            </Button>
            <Button
              variant="contained"
              type="submit"
              disableRipple
              disableFocusRipple
              disableElevation
              sx={{
                ...getSubmitButtonStyle(!!validationError),

              }}
            >
              {saveLabel}
            </Button>
          </Box>

        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default JobsiteDataEntryForm;
