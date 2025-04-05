import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecordViewMode } from '../../shared/types/viewModes.ts';
import Navigation from '../../components/Navigation/Navigation.tsx';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import JobsiteProps from '../../components/Jobsite/types.ts';

import { useSpacerBlockStyle } from '../../components/shared/styles/recordStyles.ts';

import { fetchJobsite } from '../../api/jobsiteApi.ts';

import JobsiteDetails from '../../components/Jobsite/JobsiteDetails/JobsiteDetails.tsx';
import AddJobsiteForm from '../../components/Jobsite/AddJobsiteForm/AddJobsiteForm.tsx';

import { createJobsite, deleteJobsite, updateJobsite } from '../../api/jobsiteApi.ts';

import {
  useErrorWrapperStyle, useErrorTextStyle
} from '../../components/Jobsite/AddJobsiteForm/styles.ts';
import { create } from 'domain';

const JobsitePage = (props: { initialMode: 'view' | 'create' | 'add' }) => {
  const { jobsiteId } = useParams();
  const [mode, setMode] = useState<'view' | 'add' | 'edit'>(props.initialMode || 'view'
  );
  const [jobsite, setJobsite] = useState<JobsiteProps | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);


  const navigate = useNavigate();

  const cancelJobsiteCreation = () => {
    navigate('/jobsites');
  }

  const cancelJobsiteEdit = () => {
    setMode('view');
  }

  const handleJobsiteDelete = async () => {
    try {
      const { success } = await deleteJobsite(jobsiteId);
      if (success) {
        navigate('/jobsites');
      }
    }
    catch (error) {
      setApiError(error.message);
    }
  };

  const fetchJobsiteData = async () => {
    try {
      if (mode === 'view') {
        if (!jobsiteId) {
          throw new Error('Jobsite ID is required');
        }
        const jobsiteData = await fetchJobsite({ jobsiteId: jobsiteId });
        setJobsite(jobsiteData);
      }
    }
    catch (error) {
      console.error('Error fetching jobsite data:', error);
    }
  }

  useEffect(() => {
    fetchJobsiteData();
  }, []);

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
  let callUpdateJobsite = ((jobsiteProps) =>
    updateJobsite({
      jobsiteData: jobsiteProps,
      onSuccess: (updatedRecord) => setJobsite(updatedRecord),
    }));

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
        padding: '4em 1em',
        width: '100vw',
        maxWidth: '45em',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navigation />

      <Box name="breadcrumbs">
        <Typography variant='h6'
          sx={{
            borderBottom: '1px solid #ccc',
          }}
        >
          <Box component='span'
            onClick={() => navigate('/jobsites')}
            sx={{
              padding: '0.2em',
              borderRadius: '0.25em',
              color: theme.palette.primary.dark,
              '&:hover, &:active': {
                cursor: 'pointer',
                backgroundColor: '#ddd',
              },
            }}
          >
            Jobsites
          </Box>
          &gt; <i>{jobsiteId ?? 'New Jobsite'}</i>
        </Typography>
      </Box>

      <Box sx={{
        padding: '0.5em',
      }}>

        {
          mode === 'view' &&
          (<Box>

            {apiError && (
              <Box sx={useErrorWrapperStyle}>
                {apiError && <Typography sx={useErrorTextStyle}>{apiError}</Typography>}
              </Box>
            )}


            <JobsiteDetails {...jobsite} />

            <Box
              sx={{
                marginTop: '1.25em',
              }}>

              <Button
                variant='contained'
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: theme.palette.primary.light,
                }}
                onClick={() => setMode('edit')}
              >
                <EditIcon />
              </Button>

              <Button
                variant='contained'
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: theme.palette.error.dark,
                  marginLeft: '1em',
                }}
                onClick={() => handleJobsiteDelete()}
              >
                <DeleteIcon />
              </Button>
            </Box>
          </Box>
          )
        }
        {
          mode === 'edit' &&
          (
            <AddJobsiteForm
              handleDiscard={handleDiscard}
              handleEnteredData={async (props) => {
                await handleEnteredData(props);
                setMode('view');
              }}
              jobsite={jobsite}
              {...{ mode, setMode }}
            />
          )
        }
        {
          mode === 'add' &&
          (
            <AddJobsiteForm
              handleDiscard={handleDiscard}
              handleEnteredData={async (props) => {
                await handleEnteredData(props);
                setMode('view');
              }}
              {...{ mode, setMode }}
            />
          )
        }
      </Box>
    </Box>
  );
};

export default JobsitePage;