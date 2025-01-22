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
    handleSelectForEdit,
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
                workBlockStart.toPlainTime().toLocaleString(
                  'en-US',
                  {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }
                ).toLowerCase()
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
                    <EditIcon
                      sx={{ color: 'info.main', paddingRight: 1 }}
                      onClick={() => handleSelectForEdit(workBlockId)}
                    />
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
                      const workBlockHours = workBlockStart.until(workBlockEnd).total({ unit: 'hours' });
                      const roundedWorkBlockHours = Math.round(workBlockHours * scale) / scale;
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
              workBlockEnd.toPlainTime().toLocaleString(
                'en-US',
                {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }
              ).toLowerCase()
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