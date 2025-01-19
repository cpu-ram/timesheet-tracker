import { Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

interface WorkBlockProps {
  workBlockStart: Date | null;
  workBlockEnd: Date | null;
  breakStart: Date | null;
  breakEnd: Date | null;
  jobsiteId: number;
  jobsiteAddress: string;
  jobsiteName: string;
  editMode: boolean
}

const WorkBlock = (
  {
    workBlockId,
    workBlockStart,
    workBlockEnd,
    breakStart,
    breakEnd,
    jobsiteId,
    jobsiteAddress,
    jobsiteName,
    supervisorName,
    additionalNotes,
    editMode,
    handleDeleteWorkBlock,
    handleEditWorkBlock
  }: WorkBlockProps
) => {
  return (
    <div>
      <Grid container key={workBlockId} sx={{ borderTop: 1, borderColor: 'divider' }} spacing='0'>
        <Grid item xs={editMode ? 2.5 : 1.5}>
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
                <i>[work start absent]</i>}
          </Typography>
        </Grid>
        <Grid item xs={editMode ? 6.5 : 7.5}>
          <Typography>
            {jobsiteName || <i>[jobsiteName absent]</i>}
          </Typography>
        </Grid>

        <Grid item xs={editMode ? 2.5 : 1.5}>
          <Typography sx={{
            justifyContent: 'space-between',
            display: 'flex'
          }}>
            {
              editMode ?
                (
                  <>
                    <DeleteIcon
                      sx={{ color: 'error.main' }}
                      onClick={() => handleDeleteWorkBlock(workBlockId)}
                    />
                    <EditIcon sx={{ color: 'info.main', paddingRight: 1 }} />
                  </>
                )
                :
                null
            }
          </Typography>
        </Grid>
        <Grid item xs={3} sx={{ borderLeft: 1, borderColor: 'info.main' }}>
          <Typography component='div' sx={{ paddingLeft: 2 }}>
            {
              (workBlockStart && workBlockEnd) ?
                <>
                  {
                    (() => {
                      const scale = 100;
                      const workBlockMilliseconds = (workBlockEnd.getTime() - workBlockStart.getTime());
                      const roundedWorkBlockHours = Math.round(workBlockMilliseconds / (3600 * 1000) * scale) / scale;
                      return roundedWorkBlockHours + 'h';
                    }
                    )()
                  }
                </>
                :
                <i>—</i>
            }
          </Typography>
        </Grid>
        <Grid item xs={editMode ? 6.5 : 7.5}>
          <Typography>
            {jobsiteAddress || <i>[jobsite address absent]</i>}
          </Typography>
        </Grid>

        <Grid item xs={editMode ? 2.5 : 1.5}>
          <Typography>
            To:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            {workBlockEnd ?
              format(workBlockEnd, 'hh:mm a')
              :
              <i>[work end absent]</i>
            }
          </Typography>
        </Grid>
        <Grid item xs={editMode ? 6.5 : 7.5}>
          <Typography>
            {jobsiteId ? jobsiteId.toUpperCase() : <i>[jobsiteId absent]</i>}
          </Typography>
        </Grid>
      </Grid>
    </div >
  );
}

export { WorkBlock };