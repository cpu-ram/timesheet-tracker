import { Box, Typography } from '@mui/material';
import { getFieldTitleStyle, getEntryFieldTextStyle } from '../shared/styles/recordStyles.ts';
import { JobsiteFieldValue } from './JobsiteFieldValue.tsx';

export const JobsiteFieldDisplay = ({
  title,
  value = null,
}: {
  title: string;
  value?: string | null;
}) => {
  const textVariant = 'h4';
  return (
    <Box
      className="field-display"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Typography
        sx={{
          ...getEntryFieldTextStyle(),
          padding: '0.2em 0.5em',
        }}
        variant={textVariant}
        component="p"
      >
        <Typography component="span" sx={[{ getFieldTitleStyle }, { minWidth: '7em' }]}>
          {title}
        </Typography>

        <JobsiteFieldValue>{value}</JobsiteFieldValue>
      </Typography>
    </Box>
  );
};
