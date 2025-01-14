import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { WorkBlock } from '../WorkBlock.tsx';

import DayWorkBlocks from './DayWorkBlocks.tsx';
import HoursTotal from './HoursTotal.tsx'

const workDay = ({ workData, selectedDate }) => {

  return (
    <>
      <DayWorkBlocks {...{ workData }}></DayWorkBlocks>
      <HoursTotal {...{ workData }}></HoursTotal>
    </>
  );
}

export default workDay;