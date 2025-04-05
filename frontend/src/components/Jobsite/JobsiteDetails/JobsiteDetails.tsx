import { useEffect, useState } from 'react';
import { Temporal } from '@js-temporal/polyfill';

import { Grid, TextField, Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import JobsiteProps from '../types.ts';

import { DataField } from '../../shared/DataField.tsx';
import { useFieldTitleStyle, useFieldWithMissingDataStyle, useHorizontalSeparatorStyle } from '../../shared/styles/recordStyles.ts';
import { useSpacerBlockStyle } from '../../shared/styles/generalStyles.ts';

const JobsiteDetails = ({
  jobsiteId,
  jobsiteName,
  jobsiteAddress,
  jobsiteDescription,
  supervisorName,
  defaultWorkStartTime,
  defaultWorkEndTime,
}: JobsiteProps) => {
  const textVariant = 'h4';

  const JobsiteDataField = ({
    children, isExpected
  }: { children: React.ReactNode, isExpected?: boolean }) => (
    <DataField
      isExpected={isExpected}
      additionalStyles={{
        textDecoration: 'underline',
        textUnderlineOffset: '0.3em',
        textDecorationThickness: '0.05em',
      }}
    >
      {children}
    </DataField>);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& p': {
          display: 'inline',
          width: 'auto',
          padding: '0.25em 0em 0.25em 0',
          marginRight: '0.2em',
          marginTop: '0.05em',
        },
        width: '100%',
        marginLeft: 0,
      }}>

      <Typography variant={textVariant} component="p">
        <Typography component="span" sx={useFieldTitleStyle}>
          Id:
        </Typography>

        <JobsiteDataField isExpected>
          <b>
            {jobsiteId ?? null}
          </b>
        </JobsiteDataField>
      </Typography>

      <Typography variant={textVariant} component="p">
        <Typography component="span" sx={useFieldTitleStyle}>
          Name:
        </Typography>

        <JobsiteDataField>
          {jobsiteName ?? null}
        </JobsiteDataField>
      </Typography>

      <Box sx={useSpacerBlockStyle} />

      <Typography variant={textVariant} component="p"
        sx={{
          height: '3em',
        }}
      >
        <Typography component="span" sx={useFieldTitleStyle}>
          Address:
        </Typography>

        <JobsiteDataField>
          {jobsiteAddress ?? null}
        </JobsiteDataField>
      </Typography>

      <Box sx={useSpacerBlockStyle} />

      <Typography variant={textVariant} component="p">
        <Typography component="span" sx={useFieldTitleStyle}>
          Description:
        </Typography>

        <JobsiteDataField>
          {jobsiteDescription ?? null}
        </JobsiteDataField>
      </Typography>

      <Typography variant={textVariant} component="p">
        <Typography component="span" sx={useFieldTitleStyle}>
          Supervisor:
        </Typography>

        <JobsiteDataField>
          {supervisorName ?? null}
        </JobsiteDataField>
      </Typography>

      <Box sx={{
        display: 'flex',
        width: '100%',
      }} />

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography variant={textVariant} component="p">
          <Typography component="span" sx={useFieldTitleStyle}>
            Normal Start:
          </Typography>

          <JobsiteDataField>
            {defaultWorkStartTime ? defaultWorkStartTime.toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }).toLowerCase() : null}
          </JobsiteDataField>
        </Typography>

        <Typography variant={textVariant} component="p">
          <Typography component="span" sx={useFieldTitleStyle}>
            Normal End:
          </Typography>

          <JobsiteDataField>
            {defaultWorkEndTime ? defaultWorkEndTime.toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }).toLowerCase() : null}
          </JobsiteDataField>
        </Typography>
      </Box>

    </Box >
  )
}

export default JobsiteDetails;