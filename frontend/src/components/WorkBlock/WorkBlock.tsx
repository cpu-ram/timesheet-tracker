import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

import { Grid, Typography } from '@mui/material';
import DataField from '../shared/DataField.tsx';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


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
  const columnWidths = [1.7, 2.7, 2.4, 5.2];
  return (
    <>
      <style>
        {`
        span.fieldTitle{
          font-style: oblique 20deg;  
          margin-right: 0.5em;
          min-width: 20em;
          color: #555555; /* Equivalent to gray.600 in Material-UI */
        }
        p.field-with-missing-data{
          color: {theme => theme.palette.warning.dark};
        }
      `}
      </style>
      <Grid
        container key={workBlockId}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          paddingTop: 0.75,
          paddingBottom: 0.75
        }} spacing='0'>

        <Grid item xs={columnWidths[0]}>
          <Typography>
            <span className='fieldTitle'>From:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[1]}>
          <DataField
            key={`${workBlockId}-start-time`}
            isExpected={true}
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
                null}
          </DataField>
        </Grid>
        <Grid item xs={columnWidths[2]}>
          <Typography>
            <span className='fieldTitle'>ID:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[3]}>
          <DataField isExpected={true}>
            {jobsiteId ? jobsiteId.toUpperCase() : null}
          </DataField>
        </Grid>

        <Grid item xs={columnWidths[0]}>
          <Typography
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            {
              editMode ?
                (
                  <>
                    <EditIcon
                      sx={{
                        color: 'info.main', paddingRight: 0, fontSize: '1.6em',
                        '&:active, &:hover': {
                          cursor: 'pointer',
                          boxShadow: '0 0 0 0.2rem rgba(23, 162, 184, 0.5)',
                        },
                        marginBottom: '0.8em',
                      }}
                      onClick={() => handleSelectForEdit(workBlockId)}
                    />
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

                  </>
                )
                :
                null
            }
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[1]}>
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
        <Grid item xs={columnWidths[2]}>
          <Typography>
            <span className='fieldTitle'>Address:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[3]}>
          <Typography>
            {jobsiteAddress || <>[—]</>}
          </Typography>
        </Grid>

        <Grid item xs={columnWidths[0]}>
          <Typography>
            <span className='fieldTitle'>To:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[1]}>
          <DataField
            key={`${workBlockId}-end-time`}
            isExpected={true}
          >
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
              null
            }
          </DataField>
        </Grid>

        <Grid item xs={columnWidths[2]}
          sx={{
            display: 'flex',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <Typography>
            <span className='fieldTitle'>Name:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[3]}>
          <DataField>
            {jobsiteName}
          </DataField>
        </Grid>


        <Grid item xs={12}
          sx={{
            height: 'auto',
            marginTop: '1em',
            textWrap: 'wrap',
          }}
        >
          <Typography
            sx={{
            }}>
            <span className="fieldTitle">Additional notes:</span>
            {additionalNotes || <>[—]</>}
          </Typography>
        </Grid>

      </Grid >
    </>
  );
}

export { WorkBlock };