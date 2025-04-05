import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Typography, Grid, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { fetchJobsitePreviews } from '../../api/jobsiteApi';
import Navigation from '../../components/Navigation/Navigation.tsx';

import { DataField } from '../../components/shared/DataField.tsx';
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
      justifyContent: 'flex-start',
      maxWidth: '45em',
      padding: '4em 1em',
    }}>

      <Navigation />

      <Box name="breadcrumbs">
        <Typography variant='h6'
          sx={{
            borderBottom: '1px solid #ccc',
          }}
        >
          Jobsites

        </Typography>
      </Box>
      <Box sx={{
        padding: '0.6em 0 0.6em 0',
      }}>
        <Button
          variant='outlined'
          display='flex'
          sx={{
            alignSelf: 'flex-start',
            backgroundColor: theme.palette.primary.light,
            color: 'white',
          }}
          onClick={() => navigate('/jobsites/new')}
        >
          <AddIcon />
        </Button>
      </Box>

      {
        jobsites.map((jobsite) => (
          <Box
            onClick={() => navigate(`/jobsites/${jobsite.id}`)}
            key={jobsite.id}
            role="button"
            tabIndex={0}
            sx={{
              textDecoration: 'none',
              color: () => theme.palette.text.primary,
              boxSizing: 'border-box',
              borderLeft: `0.2em solid transparent`,
              '&:hover, &:active': {
                cursor: 'pointer',
                color: () => theme.palette.text.primary,
                textDecoration: 'none',
                textUnderlineOffset: '0.3em',
                borderLeft: `0.2em solid ${theme.palette.primary.main}`,
                backgroundColor: '#f1f1f1',
              },
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              borderBottom: '1px solid #ccc',
              padding: '0.5em',
            }}
          >
            <Grid container
              sx={{
                justifyContent: 'space-between',
              }}
            >

              <Grid item xs={4}>
                <Typography variant="body1">
                  <FieldTitle>
                    {"ID:"}
                  </FieldTitle>
                  <DataField sx={{ fontWeight: 'bold' }}>
                    <b>{jobsite.id}</b>
                  </DataField>
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography variant="body1">
                  <FieldTitle>
                    {"Name:"}
                  </FieldTitle>
                  <DataField>
                    {jobsite.name}
                  </DataField>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <FieldTitle>
                    {"Address: "}
                  </FieldTitle>
                  <DataField>
                    {jobsite.address}
                  </DataField>
                </Typography>
              </Grid>


            </Grid>
          </Box>
        ))
      }
    </Box >
  )
}

export default JobsiteListPage;