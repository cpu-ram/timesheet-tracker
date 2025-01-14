import Typography from '@mui/material/Typography';
import { WorkBlock } from '../WorkBlock.tsx';
import { format } from 'date-fns';

const DayWorkBlocks = ({ workData }) => {
  return (
    <>
      <Typography variant='h6' sx={{ pt: 1, pb: 1 }}>
        Work Day data:
      </Typography>
      {
        workData ?
          (
            workData.map((workBlock) => (
              workBlock ?
                <WorkBlock {...workBlock} />
                :
                null
            ))
          )
          :
          (
            <Typography key='0' sx={{ fontStyle: 'italic' }}>
              No work records available for the selected day
            </Typography>
          )
      }
    </>
  );
}

export default DayWorkBlocks;