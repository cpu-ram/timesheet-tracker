import { Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

interface WorkBlockProps {
  workBlockStart: Date | null;
  workBlockEnd: Date | null;
  breakStart: Date | null;
  breakEnd: Date | null;
  jobsiteId: number;
  jobsiteAddress: string;
  jobsiteName: string;
}

const WorkBlock = (
  {
    id,
    workBlockStart,
    workBlockEnd,
    breakStart,
    breakEnd,
    jobsiteId,
    jobsiteAddress,
    jobsiteName
  }: WorkBlockProps
) => {
  return (
    <div>
      <Grid container key={id} sx={{ borderTop: 1, borderColor: 'divider' }} spacing='0'>
        <Grid item xs={2}>
          <Typography>
            From:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            {
              workBlockStart ?
                format(workBlockStart, 'hh:mm a')
                :
                <i>[workStart absent]</i>}
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>
            {jobsiteName || <i>[jobsiteName absent]</i>}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography>

          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ borderLeft: 1, borderColor: 'divider' }}>
          <Typography component='div' sx={{ paddingLeft: 2 }}>
            {
              (workBlockStart && workBlockEnd) ?
                <>
                  {(new Date(workBlockEnd).getTime() - new Date(workBlockStart).getTime()) / 1000 / 60 / 60 + 'h'}
                </>
                :
                <i>—</i>
            }
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>
            {jobsiteAddress || <i>[jobsiteAddress absent]</i>}
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography>
            To:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            {workBlockEnd ?
              format(workBlockEnd, 'hh:mm a')
              :
              <i>—</i>
            }
          </Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>
            {jobsiteId.toUpperCase() || <i>[jobsiteId absent]</i>}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export { WorkBlock };