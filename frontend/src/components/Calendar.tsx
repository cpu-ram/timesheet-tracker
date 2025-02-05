import { useState, useEffect } from 'react';
import { GlobalStyles, Grid, Typography, IconButton } from '@mui/material';
import { startOfDay, addDays, isSameDay, compareAsc, differenceInCalendarDays, differenceInHours } from 'date-fns';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { useTheme } from '@mui/material/styles';
import { Box, Alert } from '@mui/material';

const Calendar = ({
  multiDaySelectionMode = false,
  dateRange,
  dateSelectionHandler,
  workDataAggregator,
}) => {
  const today = startOfDay(new Date());
  const days = [];

  const [isExpanded, setIsExpanded] = useState(true);

  const theme = useTheme();
  const validateDateRange = (range) => {
    if (!range.from || !range.to || range.from > range.to) {
      throw new Error('Invalid date range');
    }
    if (range.from.getDay() !== 1 || range.to.getDay() !== 0) {
      throw new Error('Invalid date range');
    }
  }

  try {
    validateDateRange(dateRange);
  }
  catch (error) {
    throw Error(error);
  }
  for (let i = dateRange.from; i <= dateRange.to; i = addDays(i, 1)) {
    days.push(i);
  }

  const selectedWeekNumber = Math.floor(differenceInCalendarDays(dateSelectionHandler.lastSelectedSingleDate, dateRange.from) / 7);
  const daysOfSelectedWeek = days.slice(selectedWeekNumber * 7, (selectedWeekNumber + 1) * 7);

  return (
    <Box>
      <GlobalStyles
        styles={{
          body: { placeItems: 'start' },
        }}
      />

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
            borderBottom: 1,
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
                  variant="h8"
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
              { length: (differenceInCalendarDays(dateRange.to, dateRange.from) + 1) / 7 },
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
                    if (isSameDay(day, dateRange.from) || day.getDate() === 1) {
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
                  {days.slice(startIndex, startIndex + 7).map((day, index) => (
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
                          cursor: 'pointer',
                          backgroundColor:
                            !multiDaySelectionMode && dateSelectionHandler.isSelected(day) ?
                              'lightcoral'
                              :
                              multiDaySelectionMode && compareAsc(day, today) <= 0 ?
                                (dateSelectionHandler.isSelected(day)) ?
                                  theme.palette.warning.main : '#e2e3e5'
                                :
                                'transparent',
                          border: isSameDay(day, today) ? '1px dotted blue'
                            : multiDaySelectionMode && compareAsc(day, today) <= 0 ?
                              '1.3px dashed lightcoral' : 'none',
                          color: compareAsc(day, today) <= 0 ? 'black' : 'gray',
                          borderRadius: '50%',
                          padding: '0',
                          width: '1.6em',
                          minWidth: '1.6em',
                          height: '1.6em',
                          display: 'flex',
                          placeContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={
                          () => {
                            if (compareAsc(day, today) <= 0) {
                              dateSelectionHandler.handleDateClick(day);
                            }
                          }
                        }
                      >

                        {day.toLocaleString('default', { day: 'numeric' })}
                      </Typography>
                    </Grid>
                  ))}
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
                          }}
                          onClick={
                            () => {
                              if (compareAsc(day, today) <= 0) {
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
              ''
            )}
          </Typography>
        </Grid>

        <Grid key="expand"
          container item
          xs={1.5}

          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              width: 'auto',
              alignSelf: 'center',
              border: `1px solid ${theme.palette.info.dark}`,
            }}
          >
            {
              isExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />
            }
          </IconButton>
        </Grid>

        <Grid key="info"
          container item
          xs={12}
          display={multiDaySelectionMode ? 'flex' : 'none'}
          sx={{
            width: '100%',
            justifyContent: 'center',
            paddingRight: '1em',
            paddingLeft: '2em',
            paddingTop: 0,
          }}>
          {
            multiDaySelectionMode &&
            <Alert severity="info"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '0.2em 2em',
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