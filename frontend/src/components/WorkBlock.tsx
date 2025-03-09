import { Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

interface WorkBlockProps {
  workBlockStart: Temporal.PlainTime | null;
  workBlockEnd: Temporal.PlainTime | null;
  breakStart: Temporal.PlainTime | null;
  breakEnd: Temporal.PlainTime | null;
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
      <Grid
        container key={workBlockId}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          paddingTop: 0.75,
          paddingBottom: 0.75
        }} spacing='0'>
        <Grid item xs={2.5}>
          <Typography>
            From:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            key={`${workBlockId}-start-time`}
            sx={{
              color: workBlockStart ?
                'inherit'
                :
                'warning.dark'
            }}
          >
            {
              workBlockStart ?
                workBlockStart.toLocaleString(
                  'en-US',
                  {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }
                ).toLowerCase()
                :
                <>[—]</>}
          </Typography>
        </Grid>
        <Grid item xs={6.5}>
          <Typography>
            {jobsiteName || <>[  jobsite Name <i>absent</i>  ]</>}
          </Typography>
        </Grid>

        <Grid item xs={2.5}>
          <Typography
            sx={{
              justifyContent: 'space-between',
              display: 'flex'
            }}
          >
            {
              editMode ?
                (
                  <>
                    <DeleteIcon
                      sx={{
                        color: 'error.main', fontSize: '1.6em',
                        '&:active, &:hover': {
                          cursor: 'pointer',
                          boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.5)',
                        }
                      }}
                      onClick={() => handleDeleteWorkBlock(workBlockId)}
                    />
                    <EditIcon
                      sx={{
                        color: 'info.main', paddingRight: 0, fontSize: '1.6em',
                        marginRight: '10%',
                        '&:active, &:hover': {
                          cursor: 'pointer',
                          boxShadow: '0 0 0 0.2rem rgba(23, 162, 184, 0.5)',
                        }
                      }}
                      onClick={() => handleSelectForEdit(workBlockId)}
                    />
                  </>
                )
                :
                null
            }
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography component='div'
            sx={{
              height: '100%',
              marginLeft: '0.7em',
              paddingLeft: 1,
              borderLeft: 1,
              borderColor: 'black',
              fontWeight: 'bold',

              alignItems: 'center',
              display: 'flex'
            }}>
            {
              (workBlockStart && workBlockEnd) ?
                <>
                  {
                    (() => {
                      const scale = 10;
                      const workBlockHours = workBlockStart.until(workBlockEnd).total({ unit: 'hours' });
                      const roundedWorkBlockHours = Math.round(workBlockHours * scale) / scale;
                      return roundedWorkBlockHours + 'h';
                    }
                    )()
                  }
                </>
                :
                <i>0</i>
            }
          </Typography>
        </Grid>
        <Grid item xs={6.5}>
          <Typography>
            {jobsiteAddress || <>[  jobsite Address <i>absent</i>  ]</>}
          </Typography>
        </Grid>

        <Grid item xs={2.5}>
          <Typography>
            To:
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            key={`${workBlockId}-end-time`}
            sx={{
              color: workBlockEnd ?
                'inherit'
                :
                'warning.dark'
            }}>
            {workBlockEnd ?
              workBlockEnd.toLocaleString(
                'en-US',
                {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }
              ).toLowerCase()
              :
              <>[—]</>
            }
          </Typography>
        </Grid>
        <Grid item xs={6.5}>
          <Typography>
            {jobsiteId ? jobsiteId.toUpperCase() : <>[  jobsite Id <i>absent</i>  ]</>}
          </Typography>
        </Grid>
      </Grid>
    </div >
  );
}

export { WorkBlock };