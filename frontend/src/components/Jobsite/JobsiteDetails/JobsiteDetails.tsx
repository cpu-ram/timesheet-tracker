import { Temporal } from '@js-temporal/polyfill';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { JobsiteProps } from '../types.ts';

import { JobsiteFieldDisplay } from '../JobsiteFieldDisplay.tsx';

const JobsiteDetails = ({
  jobsiteId,
  jobsiteName,
  jobsiteAddress,
  jobsiteDescription,
  supervisorName,
  defaultWorkStartTime,
  defaultWorkEndTime,
}: JobsiteProps) => {
  supervisorName && true;

  const jobsiteDisplayFields = [
    { title: 'ID', value: jobsiteId },
    { title: 'Name', value: jobsiteName },
    { title: 'Address', value: jobsiteAddress },
    { title: 'Description', value: jobsiteDescription },
    // { title: 'Supervisor', value: supervisorName },
    { title: 'Typical start', value: defaultWorkStartTime },
    { title: 'Typical end', value: defaultWorkEndTime },
  ];

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',

        width: '100%',
        marginLeft: 0,

        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '4px',

        '& .field-display': {
          padding: '0.6em 0',
          backgroundColor: 'white',
        },

        '& .field-display+.field-display': {
          borderTop: '1px solid #ccc',
        },
        '& .field-display:first-of-type, .field-display:first-of-type > p': {
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        },
        '& .field-display:last-of-type, .field-display:last-of-type > p': {
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        },
      }}
    >
      {jobsiteDisplayFields.map(jobsite => (
        <JobsiteFieldDisplay
          key={jobsite.title}
          title={jobsite.title}
          value={
            jobsite.value instanceof Temporal.PlainTime
              ? jobsite.value
                  .toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                  .toLowerCase()
              : jobsite.value
          }
        />
      ))}
    </Box>
  );
};

export default JobsiteDetails;
