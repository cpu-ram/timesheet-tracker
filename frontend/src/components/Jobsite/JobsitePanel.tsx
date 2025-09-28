import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

import { ApiError } from '../../errors/ApiError.ts';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { JobsiteProps } from '../../components/Jobsite/types.ts';

import { fetchJobsite } from '../../api/jobsiteApi.ts';

import JobsiteDetails from '../../components/Jobsite/JobsiteDetails/JobsiteDetails.tsx';
import JobsiteDataEntryForm from './JobsiteDataEntryForm/JobsiteDataEntryForm.tsx';

import { createJobsite, deleteJobsite, updateJobsite } from '../../api/jobsiteApi.ts';

import { getErrorWrapperStyle, getErrorTextStyle } from '../shared/styles/generalStyles.ts';

const JobsitePanel = ({
  initialMode,
  jobsiteId,
  onClose,
  onUpdateJobsite,
  titleCallback,
}: {
  initialMode: 'view' | 'edit' | 'add';
  jobsiteId?: string;
  onClose?: () => void;
  onUpdateJobsite?: (_jobsite: JobsiteProps) => void;
  titleCallback?: (title: string) => void;
}) => {
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>(initialMode || 'view');
  const [jobsite, setJobsite] = useState<JobsiteProps | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (titleCallback && ['view', 'edit'].includes(mode) && jobsiteId) {
      titleCallback(`Jobsites > ${jobsiteId}`);
    }
  }, [titleCallback, mode, jobsiteId]);

  const navigate = useNavigate();
  const handleClose = onClose || (() => navigate('/jobsites'));

  const cancelJobsiteCreation = () => {
    handleClose();
  };

  const cancelJobsiteEdit = () => {
    setMode('view');
  };

  const handleJobsiteDelete = async () => {
    if (!jobsiteId) throw new Error('Error: No jobsite ID provided for deletion.');
    try {
      const { success } = await deleteJobsite(jobsiteId);
      if (success) {
        handleClose();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else throw error;
    }
  };

  useEffect(() => {
    if (!jobsiteId || mode === 'add' || (mode === 'edit' && jobsite)) return;

    const abortController = new AbortController();
    fetchJobsite({ jobsiteId, signal: abortController.signal })
      .then(data => {
        setJobsite(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error?.name !== 'AbortError') {
          console.error('Error fetching jobsite data: ', error);
        }
      });
    return () => abortController.abort();
  }, [mode, jobsiteId, jobsite]);

  const handleDiscard = () => {
    switch (mode) {
      case 'add':
        return cancelJobsiteCreation();
      case 'edit':
        return cancelJobsiteEdit();
      default:
        throw new Error('Invalid mode: mode must be either "add" or "edit".');
    }
  };

  const theme = useTheme();

  let handleEnteredData;
  let callUpdateJobsite = (jobsiteProps: JobsiteProps) =>
    updateJobsite({
      jobsiteData: jobsiteProps,
      onSuccess: updatedRecord => {
        setJobsite(updatedRecord);
        if (onUpdateJobsite) {
          onUpdateJobsite(updatedRecord);
        }
      },
    });

  switch (mode) {
    case 'add':
      handleEnteredData = createJobsite;
      break;
    case 'edit':
      handleEnteredData = callUpdateJobsite;
      break;
    default:
      handleEnteredData = undefined;
      break;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',

        maxWidth: '45em',
        alignSelf: 'center',
        border: 0,

        borderRadius: '4px',
        backgroundColor: 'transparent',

        '& .jobsite-panel-actions > button': {
          padding: '0.5em 0',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          color: 'black',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#e0e0e0',
            border: '1px solid #555',
          },

          boxShadow: '1.5px 1.5px 2.5px rgba(0,0,0,0.2)',
        },
        '& .jobsite-panel-actions > button.delete-button': {
          color: `${theme.palette.error.main} !important`,
        },
      }}
    >
      {mode === 'view' && (
        <Box>
          {apiError && (
            <Box sx={getErrorWrapperStyle}>
              {apiError && <Typography sx={getErrorTextStyle}>{apiError}</Typography>}
            </Box>
          )}

          {jobsite && <JobsiteDetails {...jobsite} showJobsiteId={false} />}

          <Box
            className="jobsite-panel-actions"
            sx={{
              marginTop: '0em',
              borderWidth: '0',
              borderStyle: 'solid',
              borderColor: theme.palette.grey[400],
              padding: '0.8em 0.05em',

              borderRadius: '4px',
              backgroundColor: 'inherit',

              justifyContent: {
                xs: 'flex-end',
                sm: 'flex-start',
              },
              flexDirection: 'row',
              display: 'flex',
              '& button + button': {
                marginLeft: '0.9em',
              },
            }}
          >
            <Button
              className="delete-button"
              variant="outlined"
              onClick={() => handleJobsiteDelete()}
              sx={{
                backgroundColor: 'blue',
              }}
            >
              <DeleteIcon />
            </Button>

            <Button variant="outlined" onClick={() => setMode('edit')}>
              <EditIcon />
            </Button>
          </Box>
        </Box>
      )}
      {(mode === 'edit' || mode === 'add') && (
        <JobsiteDataEntryForm
          handleDiscard={handleDiscard}
          handleEnteredData={async (props: JobsiteProps) => {
            if (!handleEnteredData)
              throw new Error("Error: Jobsite addition form's data handler is not defined.");
            await handleEnteredData(props);
            setMode('view');
          }}
          jobsite={mode === 'edit' ? jobsite : null}
          {...{ mode, setMode }}
          showJobsiteId={false}
        />
      )}
    </Box>
  );
};

export default JobsitePanel;
