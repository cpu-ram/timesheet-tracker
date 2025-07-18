import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { fetchJobsitePreviews } from '../../api/jobsiteApi';
import Navigation from '../../components/Navigation/Navigation.tsx';

import { JobsiteProps } from '../../components/Jobsite/types.ts';
import { FieldValue } from '../../components/shared/FieldValue.tsx';
import { FieldTitle } from './FieldTitle.tsx';


const JobsiteListPage = () => {
  const [jobsites, setJobsites] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchJobsitePreviews();
        setJobsites(data);
      }
      catch (error) {
        console.error('Error fetching jobsite previews:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',

      padding: '4.15em 0',

      margin: 0,
      backgroundColor: theme.palette.grey[100],
    }}>

      <Navigation />

      <Box className="breadcrumbs"
        sx={{
          display: 'flex',
          alignSelf: 'center',
          maxWidth: '45em',
          width: '100%',
          padding: '0em 0.6em 0.3em',
          borderBottom: '0px solid #ccc',

          marginBottom: '0.5em',
        }}
      >
        <Typography variant='h4'
          sx={{

            width: '100%',
            maxWidth: '45em',
            fontWeight: '700',
            fontSize: '1.8em',

            borderRadius: '4px',
            padding: '0',
          }}
        >
          Jobsites

        </Typography>
      </Box>

      <Box className="icons"
        sx={{
          marginTop: '0em',
          padding: '0 0.6em',
          maxWidth: '45em',
          width: '100%',
          alignSelf: 'center',
          backgroundColor: theme.palette.grey[100],
        }}>
        <Button
          variant='outlined'
          sx={{
            alignSelf: 'flex-start',
            display: 'flex',
            backgroundColor: 'white',
          }}
          onClick={() => navigate('/jobsites/new')}
        >
          <AddIcon
            sx={{
              color: 'black',
            }}
          />
        </Button>
      </Box>

      <Box className="jobsite-list"
        sx={{
          width: '100%',
          maxWidth: '45em',
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.5em 0.6em',
          backgroundColor: theme.palette.grey[100],

          '& > .jobsite-preview + .jobsite-preview': {
            borderTop: '0 !important',
          }
        }}
      >
        {
          jobsites &&
          jobsites.map((jobsite: JobsiteProps) => (
            <Box className="jobsite-preview"
              onClick={() => navigate(`/jobsites/${jobsite.jobsiteId}`)}
              key={jobsite.jobsiteId}
              role="button"
              tabIndex={0}
              sx={{
                textDecoration: 'none',
                color: () => theme.palette.text.primary,
                '&:hover, &:active': {
                  cursor: 'pointer',
                  color: () => theme.palette.text.primary,
                  textDecoration: 'none',
                  textUnderlineOffset: '0.3em',
                  borderLeft: `1px solid ${theme.palette.primary.main}`,
                  backgroundColor: '#f1f1f1',
                },
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                borderBottom: '1px solid #ccc',
                padding: '0.7em',

                boxSizing: 'border-box',
                backgroundColor: 'white',
                border: `1px solid ${theme.palette.grey[300]}`,
                '&:first-of-type': {
                  borderTopLeftRadius: '0.5em',
                  borderTopRightRadius: '0.5em',
                },
                '&:last-of-type': {
                  borderBottomLeftRadius: '0.5em',
                  borderBottomRightRadius: '0.5em',
                },
              }}
            >
              <Grid container
                sx={{
                  justifyContent: 'space-between',
                }}
              >

                <Grid item xs={12}>
                  <Typography variant="body1">
                    <FieldTitle>
                      {"ID:"}
                    </FieldTitle>
                    <FieldValue>
                      {jobsite.jobsiteId}
                    </FieldValue>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1">
                    <FieldTitle>
                      {"Name:"}
                    </FieldTitle>
                    <FieldValue>
                      {jobsite.jobsiteName}
                    </FieldValue>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1">
                    <FieldTitle>
                      {"Address: "}
                    </FieldTitle>
                    <FieldValue>
                      {jobsite.jobsiteAddress}
                    </FieldValue>
                  </Typography>
                </Grid>


              </Grid>
            </Box>
          ))
        }
      </Box >
    </Box >
  )
}

export default JobsiteListPage;
