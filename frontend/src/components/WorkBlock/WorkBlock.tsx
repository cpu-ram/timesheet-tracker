import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

import { Grid, Typography, Box } from '@mui/material';
import FieldValue from '../shared/FieldValue.tsx';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useStyleContext } from '../../contexts/StyleContext.tsx';

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
  const coefficient1 = 12 / 4.4;
  const coefficient2 = 12 / 7.6;
  const columnWidths = [1.7 * coefficient1, 2.7 * coefficient1, 2.6 * coefficient2, 5.0 * coefficient2];

  const { theme } = useStyleContext();

  return (

    <Grid
      className="work-block-element"
      container key={workBlockId}
      sx={{
        display: 'flex',
        padding: '1.75em 0.5em',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
      spacing='0'
    >
      <style>
        {`
            span.fieldTitle{
              font-style: oblique 20deg;  
              margin-right: 0.5em;
              color: #555555; /* Equivalent to gray.600 in Material-UI */
            }
            p.field-with-missing-data{
              color: {theme => theme.palette.warning.dark};
            },
            .MuiGrid-item{
              padding: 0;
              line-height: 0.4em;
            },
          `}
      </style>

      <Grid
        container item xs={4.8}
        alignItems="flex-start"
        sx={{
        }}>

        <Grid
          container item xs={12}
        >
          <Grid
            item xs={columnWidths[0]}
            alignItems="flex-start">
            <Typography>
              <span className='fieldTitle'>From:</span>
            </Typography>
          </Grid>
          <Grid
            item xs={columnWidths[1]}
            alignItems="flex-start">
            <FieldValue
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
            </FieldValue>
          </Grid>
        </Grid>

        <Grid
          container item xs={12}
        >
          <Grid
            item
            sm={columnWidths[0] + 0.45}
            xs={columnWidths[0] + 1}
            alignItems="flex-start">
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
          <Grid
            item
            sm={columnWidths[1] - 0.45}
            xs={columnWidths[1] - 1}
            alignItems="flex-start"
            sx={{
              borderLeft: '1px solid black',
              minHeight: '4.5em',
              height: '100%',
              margin: '0.5em 0',
              alignContent: 'center',
            }}
          >
            <Typography component='div'
              sx={{
                paddingLeft: 1,
                fontWeight: 'bold',
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
        </Grid>

        <Grid
          container item xs={12}
        >
          <Grid item xs={columnWidths[0]}>
            <Typography>
              <span className='fieldTitle'>To:</span>
            </Typography>
          </Grid>
          <Grid item xs={columnWidths[1]}>
            <FieldValue
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
            </FieldValue>
          </Grid>
        </Grid>

      </Grid>

      <Grid
        container item xs={7.2}
      >

        <Grid item xs={columnWidths[2]}>
          <Typography>
            <span className='fieldTitle'>ID:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[3]}>
          <FieldValue isExpected={true}>
            {jobsiteId ? jobsiteId.toUpperCase() : null}
          </FieldValue>
        </Grid>

        <Grid item xs={columnWidths[2]}>
          <Typography>
            <span className='fieldTitle'>Address:</span>
          </Typography>
        </Grid>
        <Grid item xs={columnWidths[3]}>
          <FieldValue isExpected={false}>
            {jobsiteAddress}
          </FieldValue>
        </Grid>


        <Grid item xs={columnWidths[2]}
        >
          <Typography>
            <span className='fieldTitle'>Name:</span>
          </Typography>
        </Grid>

        <Grid item xs={columnWidths[3]}>
          <FieldValue>
            {jobsiteName}
          </FieldValue>
        </Grid>
      </Grid>



      <Grid item xs={12}
        sx={{
          height: 'auto',
          marginTop: '1em',
          textWrap: 'wrap',
          width: '100%',
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
  );
}

export { WorkBlock };