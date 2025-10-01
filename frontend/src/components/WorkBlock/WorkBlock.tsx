import { Grid, Typography, Box, IconButton } from '@mui/material';
import FieldValue from '../shared/FieldValue.tsx';
import { Temporal } from '@js-temporal/polyfill';
import ClearIcon from '@mui/icons-material/Clear';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { usePopupContext } from '../../contexts/PopupContext.tsx';

import WorkBlockPanel from './WorkBlockPanel.tsx';


import { useStyleContext } from '../../contexts/StyleContext.tsx';
import { useTimesheetContext } from '../../contexts/TimesheetContext.tsx';

import { WorkBlockProps } from '../../types/WorkBlock.types.ts';

const WorkBlock = ({
  workBlockId,
  workBlockStart,
  workBlockEnd,
  jobsiteId,
  jobsiteAddress,
  jobsiteName,
  additionalNotes,
  showActions,

  expandable = true,
  compact = false,

  supervisorName,
  date,
}: WorkBlockProps) => {
  const { showPopup, setPopupTitle } = usePopupContext();
  const { handleDeleteWorkBlock } = useTimesheetContext();

  const calculateTotalHours = (
    workBlockStart: Temporal.PlainTime,
    workBlockEnd: Temporal.PlainTime,
  ): number => {
    const scale = 10;
    const workBlockHours = workBlockStart.until(workBlockEnd).total({ unit: 'hours' });
    const roundedWorkBlockHours = Math.round(workBlockHours * scale) / scale;
    return roundedWorkBlockHours;
  };

  const formatTime = (time: Temporal.PlainTime): string =>
    time.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();

  const totalHours = workBlockStart && workBlockEnd ?
    calculateTotalHours(workBlockStart, workBlockEnd) :
    0;

  const { theme } = useStyleContext();

  const columnWidths = [4, 8];

  const fields: {
    label: string;
    value: string | null | undefined;
    required: boolean;
    showInCompact: boolean,
  }[] = [
      { label: 'Jobsite ID', value: jobsiteId, required: false, showInCompact: true },
      { label: 'Address', value: jobsiteAddress, required: false, showInCompact: true },
      { label: 'Name', value: jobsiteName, required: false, showInCompact: true },
      { label: 'Supervisor', value: supervisorName, required: false, showInCompact: false },
      { label: 'Notes', value: additionalNotes, required: false, showInCompact: false },
    ];

  return (
    <Grid container
      key={workBlockId}
      className="work-block-element"
      sx={{
        '& .work p, & .line span, & .altFieldValue *': {
          color: theme.palette.text.primary,
          fontWeight: 450,
          lineHeight: 1,
        },
        lineHeight: 1,
        padding: '0.5em 0.7em',

        '& .line': {
          padding: '0.2em 0 0',
        }
      }}
    >
      <Grid
        container item xs={9} alignItems="flex-start"
        sx={{
          border: '0px solid grey',
          minHeight: '100%',
        }}
      >

        {
          showActions ?
            <Grid
              container item xs={12}
              sx={{
                minHeight: '100%',
                height: '100%',
              }}
            >
              <Grid container item xs={columnWidths[0]}
                sx={{
                  justifyContent: 'left',
                  alignItems: 'center',

                  paddingLeft: '1em',
                  minHeight: '100%',
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',

                    height: '2em',
                    width: '2em',
                    fontSize: '0.8em',
                    fontWeight: '1000',
                    color: 'white !important',
                    backgroundColor: theme.palette.error.dark,
                    borderRadius: '50%',

                    justifyContent: 'center',
                    alignItems: 'center',

                    '& svg, svg path': {
                      color: 'white !important',
                    },
                    '& path': {
                    }
                  }}
                >
                  <ClearIcon
                    sx={{
                      fontSize: '1.2em',
                      fontWeight: '1000',
                    }}
                    onClick={() => {
                      if (!handleDeleteWorkBlock)
                        throw new Error('Error: Work block deletion handler is missing');
                      if (!workBlockId) throw new Error('Error: Work block ID is missing');
                      handleDeleteWorkBlock(workBlockId);
                    }}
                  >
                  </ClearIcon>
                </Typography>
              </Grid>
              <Grid container item xs={columnWidths[1]}>
                {
                  fields.map((field, index) => {
                    return (
                      <Grid container item xs={12} key={index}
                        className="line"
                      >
                        <FieldValue>
                          {field.value ?? null}
                        </FieldValue>
                      </Grid>
                    );
                  })
                }
              </Grid>
            </Grid>
            :
            fields.filter(x => (!compact || x.showInCompact)).
              map((field, index) => {
                return (
                  <Grid container item xs={12} key={index}
                    className="line"
                  >
                    <Grid item xs={columnWidths[0]}>
                      <Typography>{field.label}</Typography>
                    </Grid>
                    <Grid item xs={columnWidths[1]}>
                      <FieldValue>
                        {field.value ?? null}
                      </FieldValue>
                    </Grid>
                  </Grid>
                );
              })

        }

      </Grid>

      <Grid container item xs={3} sx={{ border: '0px solid grey' }} >

        <Grid item xs={12}>
          <FieldValue>
            {workBlockStart ? formatTime(workBlockStart) : null}
          </FieldValue>
        </Grid>

        <Grid item xs={12}
          sx={{
            paddingLeft: '0.7em',
          }}
        >
          <Box component="span"
            className="altFieldValue"
            sx={{
              borderLeft: '1px solid grey',
              padding: '0.2em 0 0.2em 0.5em',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
            <Box
              sx={{
                width: '1.5em',
              }}
            >
              {totalHours}h
            </Box>

            {
              expandable && (
                <IconButton
                  sx={{
                    marginLeft: '0.4em',
                    backgroundColor: 'white',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: '50%',
                    padding: '0em',
                    color: theme.palette.primary.main
                  }}
                  onClick={
                    () => {
                      showPopup(
                        <WorkBlockPanel
                          workBlockId={workBlockId}
                          workBlockData={{
                            workBlockId,
                            workBlockStart,
                            workBlockEnd,
                            jobsiteId,
                            jobsiteAddress,
                            jobsiteName,
                            additionalNotes,
                          }}
                          titleCallback={setPopupTitle}
                          date={date}
                        />
                      );
                    }
                  }
                >
                  <FullscreenIcon
                    htmlColor={theme.palette.primary.main}
                    sx={{
                      color: 'inherit',
                      padding: '0.1em',
                      fontSize: '1.2em',
                      '& path': {
                        fill: theme.palette.primary.main,
                      },
                    }}
                  >
                  </FullscreenIcon>
                </IconButton>)
            }

          </Box>
        </Grid>

        <Grid item xs={12}>
          <FieldValue>
            {workBlockEnd ? formatTime(workBlockEnd) : null}
          </FieldValue>
        </Grid>

      </Grid>
    </Grid >
  );
};

export { WorkBlock };
