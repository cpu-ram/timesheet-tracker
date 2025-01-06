import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

const workDay = ({ workData, selectedDate }) => {
  return (
    <div>
      {workData ?
        workData.map((workBlock) => (
          workBlock ?
            <Grid container key={workBlock.id} sx={{ borderTop: 1, borderColor: 'divider' }} spacing='0'>
              <Grid item xs={2}>
                <Typography>
                  From:
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {
                    workBlock.workBlockStart ?
                      format(workBlock.workBlockStart, 'hh:mm a')
                      :
                      <i>[workStart absent]</i>}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>
                  {workBlock.jobsiteName || <i>[jobsiteName absent]</i>}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography>

                </Typography>
              </Grid>
              <Grid item xs={3} sx={{ borderLeft: 1, borderColor: 'divider' }}>
                <Typography component='div' sx={{ paddingLeft: 2 }}>
                  {
                    (workBlock.workBlockStart && workBlock.workBlockEnd) ?
                      <>
                        {(new Date(workBlock.workBlockEnd).getTime() - new Date(workBlock.workBlockStart).getTime()) / 1000 / 60 / 60 + 'h'}
                      </>
                      :
                      <i>—</i>
                  }
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>
                  {workBlock.jobsiteAddress || <i>[jobsiteAddress absent]</i>}
                </Typography>
              </Grid>

              <Grid item xs={2}>
                <Typography>
                  To:
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>
                  {workBlock.workBlockEnd ?
                    format(workBlock.workBlockEnd, 'hh:mm a')
                    :
                    <i>—</i>
                  }
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>
                  {workBlock.jobsiteId.toUpperCase() || <i>[jobsiteId absent]</i>}
                </Typography>
              </Grid>
            </Grid>
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
              <Typography align='center'>
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

    </div>
  );
}

export default workDay;