import { useState, useEffect } from 'react';
import { GlobalStyles, Grid, Typography, IconButton } from '@mui/material';
import { startOfWeek, startOfDay, addDays, isSameDay, compareAsc, differenceInCalendarDays } from 'date-fns';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { useTheme } from '@mui/material/styles';
import { Box, Alert } from '@mui/material';


const Calendar = ({
  multiDaySelectionMode = false,
  dateSelectionHandler,
}) => {
  const numberOfWeeks = 2;
  const today = startOfDay(new Date());

  const [isExpanded, setIsExpanded] = useState(true);

  const theme = useTheme();

  const firstWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -(7 * (numberOfWeeks - 1)));
  const days = Array.from({ length: numberOfWeeks * 7 }).map((_, index) => addDays(firstWeekStart, index));
  const selectedWeekNumber = Math.floor(differenceInCalendarDays(dateSelectionHandler.lastSelectedSingleDate, firstWeekStart) / 7);

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

        <Grid container item
          xs={
            10.5
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
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
              <Grid item
                xs={
                  isExpanded ?
                    1.71
                    :
                    1.5
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
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {(isExpanded ?
            Array.from(
              { length: numberOfWeeks },
              (_, index) => (index * 7)
            )
            :
            [selectedWeekNumber * 7])
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
                  }}
                >
                  {days.slice(startIndex, startIndex + 7).map((day, index) => {
                    if (isSameDay(day, firstWeekStart) || day.getDate() === 1) {
                      return (
                        <Grid item
                          xs={
                            1.71
                          }
                          key={index}
                          style={{
                            padding: '0px 8px',
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
                        isExpanded ?
                          1.71
                          :
                          1.5
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
                          width: '3em',
                          height: '1.5em',
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
                  <Grid item
                    sx={{
                      display: isExpanded ? 'none' : 'flex',
                      padding: '0 8px !important',
                      paddingTop: 0,
                      justifyContent: 'center',
                      borderLeft: '1px solid #e2e3e5',
                      placeContent: 'center',
                      alignItems: 'center',
                    }}
                    xs={1.5}
                    name="total"
                  >
                    <Typography
                      variant="h12"
                      align="center"
                      style={{
                        cursor: 'pointer',
                        padding: '0',
                        paddingLeft: '0.7em',
                        width: '3em',
                        height: '1.5em',
                        placeContent: 'center',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                      }}>
                      [total]
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid >

        <Grid container item
          xs={1.5}
          key="expand"
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

        <Grid container item
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