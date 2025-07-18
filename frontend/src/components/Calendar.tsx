import { useState } from 'react';
import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';

import { Temporal } from '@js-temporal/polyfill';
import { addDays } from '../utils/temporalFunctions.ts';

import { Grid, Typography, IconButton, Box, Alert } from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import CompressIcon from '@mui/icons-material/Compress';
import { useTheme } from '@mui/material/styles';


const Calendar = () => {
  const {
    dateRange, multiDaySelectionMode,
    dateSelectionHandler,
    workDataAggregator,
  } = useTimesheetContext();

  const today = Temporal.Now.plainDateISO();
  const days: Temporal.PlainDate[] = [];

  const [isExpanded, setIsExpanded] = useState(false);

  const theme = useTheme();
  const validateDateRange = (range: {
    from: Temporal.PlainDate;
    to: Temporal.PlainDate;
  }) => {
    if (!range.from || !range.to || Temporal.PlainDate.compare(range.from, range.to) > 0) {
      throw new Error('Invalid date range');
    }
    if (range.from.dayOfWeek !== 1 || range.to.dayOfWeek !== 7) {
      throw new Error('Invalid date range');
    }
  }

  try {
    validateDateRange(dateRange);
  }
  catch (error) {
    throw error;
  }
  for (
    let day = dateRange.from; Temporal.PlainDate.compare(day, dateRange.to) <= 0; day = addDays(day, 1)
  ) {
    days.push(day);
  }

  const selectedWeekNumber = Math.floor(
    dateRange.from.until(
      dateSelectionHandler.lastSelectedSingleDate,
      { largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc' }
    ).days / 7
  );
  const daysOfSelectedWeek = days.slice(selectedWeekNumber * 7, (selectedWeekNumber + 1) * 7);

  return (
    <Box
      className="calendar-root"
      sx={{
        display: 'flex',
        selfAlign: 'center',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        backgroundColor: 'white',
        boxSizing: 'border-box',

        padding: '0.75em 1.5em',

        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: '0',
      }}>

      <Grid container item
        xs={12}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        spacing={2}
      >

        <Grid key='calendar'
          container item
          xs={
            isExpanded ?
              10.5
              :
              8.5
          }
          md={
            isExpanded ?
              10.5
              :
              9.5
          }
          spacing={2}
          sx={{
            borderColor: 'divider',
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Grid container item
            xs={12}
            key="dayNames"
            spacing={1}
            sx={{
              paddingTop: 0,
            }}
          >
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((dayName, index) => (
              <Grid item
                xs={
                  1.71
                }
                key={index}
                sx={{
                  padding: '0px 8px',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    fontStyle: 'italic',
                  }}
                >
                  {dayName}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {(isExpanded ?
            Array.from(
              { length: (dateRange.from.until(dateRange.to).days + 1) / 7 },
              (_, index) => (index * 7)
            )
            :
            [(selectedWeekNumber * 7)])
            .map((startIndex) => (

              <Grid container item xs={12} key={startIndex}
                sx={{
                  paddingTop: 0,
                }}
              >
                <Grid container spacing={1} key="month-header"
                  sx={{
                    paddingTop: 0,
                    paddingBottom: 1.1,
                    display: isExpanded ? 'flex' : 'none',
                  }}
                >
                  {days.slice(startIndex, startIndex + 7).map((day, index) => {
                    if (day.equals(dateRange.from) || day.day === 1) {
                      return (
                        <Grid item
                          xs={
                            1.71
                          }
                          key={index}
                          style={{
                            padding: '0',
                            paddingTop: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            textDecoration: 'underline'
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                          >
                            {day.toLocaleString('default', { month: 'short' })}
                          </Typography>
                        </Grid>
                      );
                    }
                    return (
                      <Grid item
                        xs={
                          1.71
                        }
                        key={index}
                        style={{
                          padding: '0 8px',
                          paddingTop: 0,
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                      </Grid>
                    );
                  })}
                </Grid>

                <Grid container spacing={1} id="days"
                  sx={{
                    paddingTop: 0,
                  }}
                >
                  {
                    days.slice(startIndex, startIndex + 7).map((day, index) => {

                      function getDayStyle(day: Temporal.PlainDate) {
                        let dayColor = 'black';
                        let cursor = 'pointer';
                        if (Temporal.PlainDate.compare(day, today) > 0) {
                          dayColor = 'darkgray';
                          cursor = 'default';
                        }
                        return {
                          color: dayColor,
                          cursor: cursor
                        }
                      }

                      return (
                        <Grid item
                          xs={
                            1.71
                          }
                          key={index}
                          style={{
                            padding: '0 8px',
                            paddingTop: 0,
                            display: 'flex', justifyContent: 'center'
                          }}
                        >
                          <Typography variant="h6" align="center"
                            style={{
                              cursor: `${getDayStyle(day).cursor}`,
                              backgroundColor:
                                !multiDaySelectionMode && dateSelectionHandler.isSelected(day) ?
                                  'lightcoral'
                                  :
                                  multiDaySelectionMode && Temporal.PlainDate.compare(day, today) <= 0 ?
                                    (dateSelectionHandler.isSelected(day)) ?
                                      theme.palette.warning.main : '#e2e3e5'
                                    :
                                    'transparent',
                              border: day.equals(today) ? '1px dotted blue'
                                : multiDaySelectionMode && Temporal.PlainDate.compare(day, today) <= 0 ?
                                  '1.3px dashed lightcoral' : 'none',
                              borderRadius: '50%',
                              padding: '0',
                              width: '1.6em',
                              minWidth: '1.6em',
                              height: '1.6em',
                              display: 'flex',
                              placeContent: 'center',
                              alignItems: 'center',
                              fontWeight: (workDataAggregator.getDayWorkHoursTotal(day) > 0) ? '600' : '400',
                              color: `${getDayStyle(day).color}`,
                              textDecoration: (workDataAggregator.getDayWorkHoursTotal(day) > 0 && isExpanded) ? 'none' : 'none',
                            }}
                            onClick={
                              () => {
                                if (Temporal.PlainDate.compare(day, today) <= 0) {
                                  dateSelectionHandler.handleDateClick(day);
                                  setIsExpanded(false);
                                }
                              }
                            }
                          >

                            {day.toLocaleString('default', { day: 'numeric' })}
                          </Typography>
                        </Grid>
                      )
                    })
                  }
                </Grid>
                {
                  !isExpanded &&

                  <Grid container spacing={1} id="dayHours"
                    sx={{
                      paddingTop: 0,
                    }}
                  >
                    {days.slice(startIndex, startIndex + 7).map((day, index) => (
                      <Grid item
                        xs={
                          1.71
                        }
                        key={index}
                        style={{
                          padding: '0 8px',
                          paddingTop: 0,
                          margin: '0.7em 0',
                          display: 'flex', justifyContent: 'center'
                        }}
                      >
                        <Typography variant="subtitle1" align="center"
                          style={{
                            fontStyle: 'italic',
                            padding: '0',
                            width: '1.6em',
                            minWidth: '1.6em',
                            height: '1.6em',
                            display: 'flex',
                            placeContent: 'center',
                            alignItems: 'center',
                            letterSpacing: '-1px',
                          }}
                          onClick={
                            () => {
                              if (Temporal.PlainDate.compare(day, today) <= 0) {
                                dateSelectionHandler.handleDateClick(day);
                              }
                            }
                          }
                        >

                          {
                            workDataAggregator.getDayWorkHoursTotal(day) > 0 ?
                              workDataAggregator.getDayWorkHoursTotal(day) + 'h'
                              :
                              ''
                          }
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                }
              </Grid>
            ))}
        </Grid >

        <Grid key="weekWorkHoursTotal"
          container item
          xs={2}
          md={1}
          lg={1}
          sx={{
            display: isExpanded ? 'none' : 'flex',
            padding: '0 !important',
            marginTop: '0 !important',
          }}
        >

          <Typography
            variant="body1"
            sx={{
              paddingLeft: '1em',
              paddingTop: '0',
              textAlign: 'center',
            }}
          >
            {"Week total: "}
            {workDataAggregator.getWeekWorkHoursTotal(daysOfSelectedWeek) > 0 ? (
              <i>{workDataAggregator.getWeekWorkHoursTotal(daysOfSelectedWeek)}h</i>
            ) : (
              '0'
            )}
          </Typography>
        </Grid>

        <Grid key="sideButtons"
          container item
          xs={1}
          sx={{
            display: 'flex',
            height: 'auto',
            width: 'auto',
            maxWidth: '2em',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
            paddingTop: '0',
            margin: '1.5em 0 0 0.5em',
            gap: 1.5,
            paddingRight: '0.5em !important',
            paddingLeft: '0.6em !important',
            boxSizing: 'border-box',
          }}
        >
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              width: 'auto',
              alignSelf: 'flex-start',
              border: `1px solid ${theme.palette.info.dark}`,
              background: isExpanded ? theme.palette.info.dark : 'transparent',
              '&:hover': {
                background: isExpanded ? theme.palette.primary.dark : 'auto',
              },
              color: isExpanded ? 'white' : theme.palette.info.dark,
            }}
          >
            {isExpanded ?
              <CompressIcon />
              : <UnfoldMoreIcon />}
          </IconButton>

        </Grid>

        <Grid key="info"
          container item
          xs={12}
          display={multiDaySelectionMode ? 'flex' : 'none'}
          sx={{
            width: '100%',
            display: multiDaySelectionMode ? 'flex' : 'none',
            justifyContent: 'center',
            justifyItems: 'center',
            alignItems: 'center',
          }}>
          {
            multiDaySelectionMode &&
            <Alert severity="info"
              sx={{
                width: '100%',
                margin: '0 0.5em 0.4em',
                display: 'flex',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              Choose the days
            </Alert>
          }
        </Grid>
      </Grid >
    </Box >
  );
};

export default Calendar;
