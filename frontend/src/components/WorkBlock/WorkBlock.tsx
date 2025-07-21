import { Grid, Typography } from '@mui/material';
import FieldValue from '../shared/FieldValue.tsx';
import { Temporal } from '@js-temporal/polyfill';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



import { WorkBlockProps } from '../../types/WorkBlock.types.ts';

const WorkBlock = (
  {
    workBlockId,
    workBlockStart,
    workBlockEnd,
    jobsiteId,
    jobsiteAddress,
    jobsiteName,
    additionalNotes,
    editMode,
    handleDeleteWorkBlock,
    handleSelectForEdit,
  }: WorkBlockProps
) => {
  const columnWidths = [
    0,
    12,
    4.1,
    7.9,
  ];

  const leftSideWidth = 8.3;
  const rightSideWidth = 3.7;

  const calculateTotalHours = (workBlockStart: Temporal.PlainTime, workBlockEnd: Temporal.PlainTime): number => {
    const scale = 10;
    const workBlockHours = workBlockStart.until(workBlockEnd).total({ unit: 'hours' });
    const roundedWorkBlockHours = Math.round(workBlockHours * scale) / scale;
    return roundedWorkBlockHours;
  };
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
        container item xs={leftSideWidth}
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

      <Grid
        container item xs={rightSideWidth}
        alignItems="flex-start"
        sx={{
        }}>

        <Grid
          container item xs={12}
        >
          <Grid
            item xs={columnWidths[0]}
            alignItems="flex-start">
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
          sx={{
            paddingLeft: '0.7rem',
          }}
        >

          <Grid
            item
            xs={9}
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
                    {calculateTotalHours(workBlockStart, workBlockEnd)}h
                  </>
                  :
                  <i>0</i>
              }
            </Typography>
          </Grid>

          <Grid
            item
            xs={3}
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
                          filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4))',
                          '&:active, &:hover': {
                            cursor: 'pointer',
                            boxShadow: '0 0 0 0.2rem rgba(23, 162, 184, 0.5)',
                          },
                          marginBottom: '0.7em',
                          marginTop: '0.3em',
                        }}
                        onClick={() => {
                          if (!workBlockId) throw new Error('Error: Work block ID is missing');
                          if (!handleSelectForEdit) throw new Error('Error: work block selection handler is missing');
                          handleSelectForEdit(workBlockId)
                        }
                        }
                      />
                      <DeleteIcon
                        sx={{
                          color: 'error.main', fontSize: '1.6em',
                          '&:active, &:hover': {
                            cursor: 'pointer',
                            boxShadow: '0 0 0 0.2rem rgba(220, 53, 69, 0.5)',
                          },
                          filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.4))',

                        }}
                        onClick={() => {
                          if (!handleDeleteWorkBlock) throw new Error('Error: Work block deletion handler is missing');
                          if (!workBlockId) throw new Error('Error: Work block ID is missing');
                          handleDeleteWorkBlock(workBlockId)
                        }
                        }
                      />

                    </>
                  )
                  :
                  null
              }
            </Typography>
          </Grid>

        </Grid>

        <Grid
          container item xs={12}
        >
          <Grid item xs={columnWidths[0]}>
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
