import { useEffect } from 'react';
import React, { useState } from 'react';
import { Grid, TextField, Box, Button, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTimesheetContext } from '../../../contexts/TimesheetContext.tsx';
import { usePopupContext } from '../../../contexts/PopupContext.tsx';
import { useNotificationContext } from '../../../contexts/NotificationContext.tsx';

import { ApiError } from '../../../errors/ApiError.ts';
import { getErrorWrapperStyle, getErrorTextStyle } from '../../shared/styles/generalStyles.ts';

import { JOBSITE_ID_MAX_LENGTH } from '../../../utils/validation/jobsiteValidation.ts';

import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';

import { Temporal } from '@js-temporal/polyfill';
import {
  convertDateToPlainTime,
  convertPlainTimeToDate,
} from '../../../utils/temporalFunctions.ts';

import { LocalizationProvider, DesktopTimePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { WorkBlockEntryFormProps, WorkBlockData } from '../../../types/WorkBlock.types.ts';
import { JobsiteProps } from '../../Jobsite/types.ts';

import JobsiteSearch from '../../Jobsite/JobsiteSearch/JobsiteSearch.tsx';
import JobsitePanel from '../../Jobsite/JobsitePanel.tsx';
import { SuggestedData } from './SuggestedData.tsx';
import { fetchJobsite } from '../../../api/jobsiteApi.ts';

export const WorkBlockEntryForm = ({
  workBlockData,
  mode,
}: WorkBlockEntryFormProps) => {
  const { multiDaySelectionMode, dateSelectionHandler, handleAddWorkBlock, handleEditWorkBlock, handleDiscard } =
    useTimesheetContext();
  const { displayNotification } = useNotificationContext();

  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  type WorkBlockSubmitArgs =
    | {
      workBlockData: WorkBlockData;
      onJobsiteCreated?: (jobsiteId: string) => void;
    }
    | {
      workBlockId: string,
      workBlockData: WorkBlockData;
      onJobsiteCreated?: (jobsiteId: string) => void;
    }
    ;

  let onEnteredData: (args: WorkBlockSubmitArgs) => void;
  switch (mode) {
    case 'add':
      onEnteredData = handleAddWorkBlock;
      break;
    case 'edit':
      onEnteredData = handleEditWorkBlock;
      break;
    default: throw new Error('Invalid mode: ' + mode);
  }

  const workBlockEntryFormTitle = (() => {
    if (mode === 'add') return 'Add work block';
    else if (mode === 'edit') return 'Edit work block';
    else throw new Error('Invalid mode: ' + mode);
  })();

  const initializeFormData = () => ({
    workBlockStart: workBlockData?.workBlockStart || null,
    workBlockEnd: workBlockData?.workBlockEnd || null,
    jobsiteId: workBlockData?.jobsiteId || null,
    supervisorName: workBlockData?.supervisorName || null,
    jobsiteAddress: workBlockData?.jobsiteAddress || null,
    jobsiteName: workBlockData?.jobsiteName || null,
    additionalNotes: workBlockData?.additionalNotes || null,
  });

  function mergeSuggested<K extends keyof WorkBlockData>({
    fields,
    suggestedData,
  }: {
    fields: K[];
    suggestedData: WorkBlockData;
  }) {
    if (!suggestedData) throw new Error('Error: Suggested jobsite data missing');

    const updates: Partial<WorkBlockData> = {};
    for (const field of fields) {
      updates[field] = suggestedData[field];
    }
    setFormData(prevProps => ({
      ...prevProps,
      ...updates,
    }));

    setSuggestedData(prevProps => {
      const newProps = { ...prevProps };
      for (const field of fields) {
        delete newProps[field];
      }
      return newProps;
    });
  }

  const [formData, setFormData] = useState<WorkBlockData>(initializeFormData());
  const [suggestedData, setSuggestedData] = useState<WorkBlockData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [existingJobsiteRecordId, setExistingJobsiteRecordId] = useState<string | null>(null);

  const [saveLabel, discardLabel] = (() => {
    if (mode === 'add') return ['Add', 'Discard'];
    if (mode === 'edit') return ['Save', 'Cancel'];

    throw new Error();
  })();

  useEffect(() => {
    if (validationError && validateTimes()) {
      setValidationError(null);
    }
  }, [formData.workBlockStart, formData.workBlockEnd]);

  useEffect(() => {
    workBlockData?.jobsiteId && tryUpdateJobsite(workBlockData.jobsiteId);
  }, [workBlockData?.jobsiteId]);

  const tryUpdateJobsite = async (newIdEntry: string) => {
    if (newIdEntry !== existingJobsiteRecordId) {
      // fetch only if the entered ID changed
      const foundJobsiteRecord = await fetchJobsite({ jobsiteId: newIdEntry });

      if (foundJobsiteRecord) {
        setExistingJobsiteRecordId(newIdEntry);
        applyJobsiteToFormData(foundJobsiteRecord);
      } else if (!foundJobsiteRecord && existingJobsiteRecordId) {
        setExistingJobsiteRecordId(null);
        clearJobsiteBoundData();
      }
    }
  };
  const applyJobsiteToFormData = (jobsiteData: JobsiteProps) => {
    setFormData(prevData => ({
      ...prevData,
      jobsiteAddress: jobsiteData.jobsiteAddress,
      jobsiteName: jobsiteData.jobsiteName,
    }));
    setSuggestedData({
      workBlockStart: jobsiteData.defaultWorkStartTime || null,
      workBlockEnd: jobsiteData.defaultWorkEndTime || null,
    });
  };
  const clearJobsiteBoundData = () => {
    setFormData(prevData => ({
      ...prevData,
      jobsiteAddress: '',
      jobsiteName: '',
    }));
    setSuggestedData(null);
  };

  const handleSelectJobsite = ({ jobsiteId }: { jobsiteId: string }) => {
    setFormData(prevData => ({
      ...prevData,
      jobsiteId: jobsiteId,
    }));
    tryUpdateJobsite(jobsiteId);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    options: { transformUppercase?: boolean } = { transformUppercase: false },
  ) => {
    const { name, value } = event.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: options.transformUppercase ? value.toUpperCase() : value,
    }));
  };

  const handleStartTimeChange = (date: Date | null) => {
    if (date === null) {
      setFormData(prevData => ({
        ...prevData,
        workBlockStart: null,
      }));
      return;
    }
    if (isNaN(date.getTime())) return;
    if (validationError && validateTimes()) {
      setValidationError(null);
    }

    setFormData(prevData => ({
      ...prevData,
      workBlockStart: convertDateToPlainTime(date),
    }));
  };

  const handleEndTimeChange = (date: Date | null) => {
    if (date === null) {
      setFormData(prevData => ({
        ...prevData,
        workBlockEnd: null,
      }));
      return;
    }
    if (isNaN(date.getTime())) return;
    if (validationError && validateTimes()) {
      setValidationError(null);
    }

    setFormData(prevData => ({
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
  };

  const handleJobsiteCreated = (jobsiteId: string) => {
    displayNotification({
      content: (
        <>
          {`New jobsite record created: `}
          <Box
            component="span"
            sx={{
              fontStyle: 'italic',
              textUnderlineOffset: '0.2em',
              boxSizing: 'border-box',
            }}
          >
            <Link
              href={`jobsites/${jobsiteId}`}
              sx={{
                alignItems: 'center',
                gap: '0.25em',
                padding: 0,
                color: 'inherit !important',
                borderBottom: '1px solid',
                '&:hover': {
                  fontWeight: 700,
                },
                '&:hover > svg': {},
                textDecoration: 'none',
              }}
            >
              {jobsiteId}
              <LinkIcon
                sx={{
                  fontSize: '1.5em',
                  verticalAlign: 'middle',
                  marginBottom: '0.15em',
                  marginLeft: '0.15em',
                }}
              />
            </Link>
          </Box>
        </>
      ),
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateTimes()) {
      if (validationError !== null) setValidationError(null);
      try {
        switch (mode) {
          case 'add':
            await onEnteredData({
              workBlockData: formData,
              onJobsiteCreated: handleJobsiteCreated,
            });
            break;
          case 'edit':
            await onEnteredData({
              workBlockId: workBlockData?.workBlockId,
              workBlockData: formData,
              onJobsiteCreated: handleJobsiteCreated,
            });
        }
        handleDiscard();
      } catch (error) {
        if (error instanceof ApiError) {
          setApiError(error.message);
        }
      }
    } else {
      const validationErrorString = 'Error: end time must be after start time';
      setValidationError(validationErrorString);
    }
  };

  const handleSelectMultiDaySelectionMode = () => {
    dateSelectionHandler.switch();
  };

  const theme = useTheme();

  const { showPopup, hidePopup } = usePopupContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        id="workBlockEntryFormRootWrapper"
        className="work-block-entry-form work-block-element"
        sx={{
          display: 'flex',
          flexDirection: 'column',

          maxWidth: '45em',
          flexGrow: 1,

          padding: '0.5em 1em 1em 1em',

          borderBottom: '1.5px solid ' + theme.palette.divider,
          margin: '0',

          backgroundColor: 'white',

          '& .entry-field + .entry-field': {
            marginTop: '0.7em',
          },
          '& input, .entry-field, textarea': {
            backgroundColor: theme.palette.grey[100],
          },
          '& div.jobsite-link-wrapper': {
            backgroundColor: theme.palette.grey[100] + ' !important',
          },
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            all: 'unset',
            display: 'contents',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              display: 'block',
              width: '100%',
              padding: '0.5em 0',

              fontWeight: 600,
            }}
          >
            {workBlockEntryFormTitle}
          </Typography>

          <JobsiteSearch foundDataCallback={handleSelectJobsite} />

          <Grid container spacing={1}>
            {validationError && (
              <Grid item xs={12} sx={getErrorWrapperStyle}>
                {<Typography sx={getErrorTextStyle}>{validationError}</Typography>}
              </Grid>
            )}

            {apiError && (
              <Grid
                item
                xs={12}
                sx={{
                  margin: 0,
                  paddingBottom: 1,
                  paddingLeft: 1.5,
                }}
              >
                {
                  <Typography
                    sx={{
                      color: 'red',
                      padding: '0 0.5em',
                    }}
                  >
                    {apiError}
                  </Typography>
                }
              </Grid>
            )}

            <Grid item xs={7} sm={9} md={10}>
              <Grid xs={12} className="entry-field" container item>
                <Grid item xs={existingJobsiteRecordId ? 9 : 12} sx={{}}>
                  <TextField
                    label="ID"
                    name="jobsiteId"
                    className="entry-field"
                    value={formData.jobsiteId ?? ''}
                    onChange={event => {
                      const value = event.target.value;
                      if (value.length <= JOBSITE_ID_MAX_LENGTH) {
                        handleInputChange(event, { transformUppercase: true });
                      }
                    }}
                    onBlur={event => {
                      tryUpdateJobsite(event.target.value);
                    }}
                    fullWidth
                    inputProps={{
                      maxLength: JOBSITE_ID_MAX_LENGTH,
                      autoComplete: 'off',
                    }}
                  />
                </Grid>

                {existingJobsiteRecordId && (
                  <Grid
                    className="jobsite-link-wrapper"
                    item
                    xs={3}
                    sx={{
                      margin: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      backgroundColor: theme.palette.grey[100],
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        showPopup(
                          <JobsitePanel
                            initialMode="view"
                            jobsiteId={existingJobsiteRecordId}
                            onClose={hidePopup}
                            onUpdateJobsite={(jobsiteData: JobsiteProps) => {
                              applyJobsiteToFormData(jobsiteData);
                              setExistingJobsiteRecordId(jobsiteData.jobsiteId ?? '');
                            }}
                          ></JobsitePanel>,
                        )
                      }
                    >
                      <LinkIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: '1.25em',
                          '&:hover': {
                            color: theme.palette.primary.dark,
                          },
                        }}
                      />
                    </IconButton>
                  </Grid>
                )}
              </Grid>

              <TextField
                label="Address"
                className="entry-field"
                name="jobsiteAddress"
                value={formData.jobsiteAddress ?? ''}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  autoComplete: 'off',
                }}
                disabled={!!existingJobsiteRecordId}
                multiline
                maxRows={2}
              />
              <TextField
                label="Name"
                name="jobsiteName"
                className="entry-field"
                value={formData.jobsiteName ?? ''}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  autoComplete: 'off',
                }}
                disabled={!!existingJobsiteRecordId}
              />
              <TextField
                label="Supervisor"
                name="supervisorName"
                className="entry-field"
                value={formData.supervisorName ?? ''}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  autoComplete: 'off',
                }}
              />
            </Grid>

            <Grid
              item
              xs={5}
              sm={3}
              md={2}
              sx={{
                height: 'auto',
              }}
            >
              {!isMobile ? (
                <DesktopTimePicker
                  className="entry-field"
                  label="From"
                  name="startTime"
                  value={
                    formData.workBlockStart ? convertPlainTimeToDate(formData.workBlockStart) : null
                  }
                  onChange={handleStartTimeChange}
                  slotProps={{
                    textField: {
                      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                        handleStartTimeChange(
                          event.target.value ? new Date(event.target.value) : null,
                        );
                      },
                      InputLabelProps: {
                        shrink: true,
                      },
                      fullWidth: true,
                      inputProps: {
                        step: 600,
                      },
                    },
                  }}
                />
              ) : (
                <MobileTimePicker
                  className="entry-field"
                  label="From"
                  name="startTime"
                  value={
                    formData.workBlockStart ? convertPlainTimeToDate(formData.workBlockStart) : null
                  }
                  onChange={handleStartTimeChange}
                  slotProps={{
                    textField: {
                      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                        handleStartTimeChange(
                          event.target.value ? new Date(event.target.value) : null,
                        );
                      },
                      InputLabelProps: {
                        shrink: true,
                      },
                      fullWidth: true,
                      inputProps: {
                        step: 600,
                      },
                    },
                  }}
                />
              )}
              {!isMobile ? (
                <DesktopTimePicker
                  className="entry-field"
                  label="To"
                  name="endTime"
                  value={
                    formData.workBlockEnd ? convertPlainTimeToDate(formData.workBlockEnd) : null
                  }
                  onChange={handleEndTimeChange}
                  slotProps={{
                    textField: {
                      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                        handleEndTimeChange(
                          event.target.value ? new Date(event.target.value) : null,
                        );
                      },
                      InputLabelProps: {
                        shrink: true,
                      },
                      inputProps: {
                        step: 600,
                      },
                      fullWidth: true,
                    },
                  }}
                />
              ) : (
                <MobileTimePicker
                  className="entry-field"
                  label="To"
                  name="endTime"
                  value={
                    formData.workBlockEnd ? convertPlainTimeToDate(formData.workBlockEnd) : null
                  }
                  onChange={handleEndTimeChange}
                  slotProps={{
                    textField: {
                      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                        handleEndTimeChange(
                          event.target.value ? new Date(event.target.value) : null,
                        );
                      },
                      InputLabelProps: {
                        shrink: true,
                      },
                      inputProps: {
                        step: 600,
                      },
                      fullWidth: true,
                    },
                  }}
                />
              )}

              {suggestedData &&
                suggestedData.workBlockStart &&
                suggestedData.workBlockEnd &&
                !(formData.workBlockStart || formData.workBlockEnd) && (
                  <SuggestedData
                    fields={['workBlockStart', 'workBlockEnd']}
                    suggestedWorkBlockProps={suggestedData}
                    handleMerge={mergeSuggested}
                  />
                )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional notes"
                name="additionalNotes"
                className="entry-field"
                value={formData.additionalNotes ?? ''}
                onChange={handleInputChange}
                fullWidth
                inputProps={{
                  autoComplete: 'off',
                }}
                multiline
                minRows={1}
                maxRows={6}
              />
            </Grid>

            <Grid
              className="buttonsWrapper"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                height: 'auto',
                padding: '0.75em 0.5em !important',
                marginTop: '0.6em',

                '& > button + button': {
                  marginLeft: '0.5em',
                },
              }}
              item
            >
              <Button
                type="submit"
                variant="outlined"
                disabled={validationError !== null}
                value="Save"
                sx={{
                  boxShadow: validationError
                    ? `0px 0px 3px ${theme.palette.action.disabledBackground}`
                    : '1px 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                {saveLabel}
              </Button>

              <Button
                variant="outlined"
                onClick={handleDiscard}
                value="Discard"
                sx={{
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.grey[900],
                  boxShadow: '2px 2px 3px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: '#d6d8db',
                    color: 'black',
                  },
                }}
              >
                {discardLabel}
              </Button>

              {mode === 'add' && (
                <Button
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      backgroundColor: '#d6d8db',
                      color: 'black',
                    },
                    ...(multiDaySelectionMode
                      ? {
                        backgroundColor: theme.palette.warning.light,
                        color: 'black',
                      }
                      : {
                        backgroundColor: theme.palette.grey[100],
                        boxShadow: '2px 2px 3px rgba(0,0,0,0.2)',
                        color: theme.palette.grey[900],
                      }),
                  }}
                  onClick={handleSelectMultiDaySelectionMode}
                >
                  {multiDaySelectionMode ? 'Duplicate off' : 'Duplicate'}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkBlockEntryForm;
