import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation.tsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { useSearchParams } from 'react-router-dom';

import JobsitePanel from '../../components/Jobsite/JobsitePanel.tsx';

const JobsitePage = (props: { initialMode: 'view' | 'add' | 'edit' }) => {
  const { jobsiteId } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const theme = useTheme();

  return (
    <Box
      className="jobsite-page"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100% !important',
        minWidth: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',

        padding: '3.2em 0.6em',

        margin: 0,
        backgroundColor: theme.palette.grey[100],
        '& .breadcrumbs': {
          display: 'flex',
          width: '100%',
          border: 0,
        },
      }}
    >
      <Navigation />

      <Box
        className="main-content"
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <Box
          className="breadcrumbs"
          sx={{
            maxWidth: '45em',
            alignSelf: 'center',
            padding: '0.95em 0',
          }}
        >
          {searchParams.get('fromName') && searchParams.get('fromLink') && (
            <Box
              sx={{
                '& a': {
                  color: 'black',
                },
              }}
            >
              <Link to={(searchParams.get('fromLink') as string) ?? ''}>
                <Typography
                  key="back-link"
                  variant="subtitle1"
                  sx={{
                    backgroundColor: theme.palette.grey[200],
                    padding: '0.1em 0.4em',
                    margin: '0.2em 0 0.25em -0.7em',
                    width: 'fit-content',
                    borderRadius: '0.25em',
                    border: '1px solid #ccc',
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      position: 'relative',
                      top: '0.2em',
                      marginRight: '0.2em',
                      fontSize: '1em',
                    }}
                  />{' '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 500,
                      textUnderlineOffset: '0.25em',
                      textDecoration: 'none',
                    }}
                  >
                    {searchParams.get('fromName')}
                  </Box>
                </Typography>
              </Link>
            </Box>
          )}

          <Typography
            variant="h4"
            sx={{
              padding: '0',
              fontWeight: '700',
              fontSize: '1.8em',
            }}
          >
            <Box
              component="span"
              onClick={() => navigate('/jobsites')}
              sx={{
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
            {' > '}
            <i>{jobsiteId ?? 'New Jobsite'}</i>
          </Typography>
        </Box>

        <JobsitePanel initialMode={props.initialMode ?? 'view'} jobsiteId={jobsiteId} />
      </Box>
    </Box>
  );
};

export default JobsitePage;
