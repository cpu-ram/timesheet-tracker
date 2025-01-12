import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import { WorkBlock } from './WorkBlock.tsx';

const workDay = ({ workData, selectedDate }) => {
  return (
    <div style={{ padding: '0 0 0 1rem' }}>
      <Typography variant='h6' sx={{ pt: 1, pb: 1 }}>
        Work Day data:
      </Typography>
      {
        workData ?
          workData.map((workBlock) => (
            workBlock ?
              WorkBlock({ ...workBlock })
              :
              null
          ))
          :
          <Typography key='0' sx={{ fontStyle: 'italic' }}>
            No work records available for {format(selectedDate, 'EEEE, MMM d')}
          </Typography>
      }
      {
        workData ?
          <Grid container>
            <Grid item xs={12} sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }} />
            <Grid item xs={2}></Grid>
            <Grid item xs={3}>
              <Typography align='left'>
                <b>
                  Total:
                  {workData ? workData.reduce((acc, workBlock) => (
                    workBlock.workBlockStart && workBlock.workBlockEnd ?
                      acc + (new Date(workBlock.workBlockEnd).getTime() - new Date(workBlock.workBlockStart).getTime()) / 1000 / 60 / 60
                      :
                      acc
                  ), 0) : 0}
                </b>
              </Typography>
            </Grid>
          </Grid>
          :
          null
      }

    </div >
  );
}

export default workDay;