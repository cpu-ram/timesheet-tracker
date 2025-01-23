import { useState, useEffect } from 'react';
import { GlobalStyles, Grid, Typography, IconButton } from '@mui/material';
import { startOfWeek, startOfDay, addDays, isSameDay, compareAsc } from 'date-fns';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { useTheme } from '@mui/material/styles';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Calendar = ({ selectedDate, setSelectedDate }: CalendarProps) => {

  const [isExpanded, setIsExpanded] = useState(true);
  const theme = useTheme();


  const today = startOfDay(new Date());
  const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7);
  const days = Array.from({ length: 14 }).map((_, index) => addDays(lastWeekStart, index));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  }
  return (
    <>
      <GlobalStyles
        styles={{
          body: { placeItems: 'start' },
        }}
      />

      <Grid container item
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
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
            spaciig={1}
            sx={{
              paddingTop: 0,
            }}
          >
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
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
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {(isExpanded ? [0, 7] : [7])
            .map((startIndex) => (

              <Grid container item xs={12} key={startIndex}
                sx={{
                  paddingTop: 0,
                }}
              >
                <Grid container spacing={1} key="month-header"
                  sx={{
                    paddingTop: 0,
                    paddingBottom: 0.5,
                  }}
                >
                  {days.slice(startIndex, startIndex + 7).map((day, index) => {
                    if (isSameDay(day, lastWeekStart) || day.getDate() === 1) {
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
                    <Grid item xs={1.71} key={index}
                      style={{
                        padding: '0 8px',
                        paddingTop: 0,
                        display: 'flex', justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h6" align="center"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSameDay(day, selectedDate) ? 'lightcoral' : 'transparent',
                          border: isSameDay(day, today) ? '1px solid blue' : 'none',
                          color: compareAsc(day, today) <= 0 ? 'black' : 'gray'
                        }}
                        onClick={
                          () => {
                            if (compareAsc(day, today) <= 0) {
                              handleDateClick(day);
                            }
                          }
                        }
                      >


                        {day.toLocaleString('default', { day: 'numeric' })}
                      </Typography>
                    </Grid>
                  ))}
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

      </Grid >
    </>
  );
};

export default Calendar;