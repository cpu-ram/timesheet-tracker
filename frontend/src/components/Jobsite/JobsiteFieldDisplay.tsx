import { Box, Typography } from '@mui/material';
import { useFieldTitleStyle, useEntryFieldTextStyle } from '../shared/styles/recordStyles.ts';
import { useSpacerBlockStyle } from '../shared/styles/generalStyles.ts';
import { JobsiteFieldValue } from './JobsiteFieldValue.tsx';

export const JobsiteFieldDisplay = ({
  title, value = null
}: {
  title: string; value?: string | null;
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
          ...useEntryFieldTextStyle(),
          padding: '0.2em 0.5em',
        }}
        variant={textVariant} component="p"
      >
        <Typography
          sx={{
            minWidth: '7em',
          }}
          component="span" sx={useFieldTitleStyle}>
          {title}
        </Typography>

        <JobsiteFieldValue>
          {value}
        </JobsiteFieldValue>

      </Typography>
    </Box>
  )
}