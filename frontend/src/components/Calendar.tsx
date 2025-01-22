import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { startOfWeek, startOfDay, addDays, isSameDay, compareAsc } from 'date-fns';
import { GlobalStyles } from '@mui/material';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Calendar = ({ selectedDate, setSelectedDate }: CalendarProps) => {

  const [isExpanded, setIsExpanded] = useState(false);

  const today = startOfDay(new Date());
  const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7);
  const days = Array.from({ length: 14 }).map((_, index) => addDays(lastWeekStart, index));

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  }
  return (
    <>
      <GlobalStyles styles={{ body: { placeItems: 'start' } }} />
      <Grid container spacing={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Grid container item xs={12} key="dayNames">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
            <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="h8"
                align="center"
                style={{
                  fontStyle: 'italic'
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {(isExpanded ? [0, 7] : [7]).map((startIndex) => (
          <Grid container item xs={12} key={startIndex}>
            <Grid container spacing={1} key="month-header">
              {days.slice(startIndex, startIndex + 7).map((day, index) => {
                if (isSameDay(day, lastWeekStart) || day.getDate() === 1) {
                  return (
                    <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
                      <Typography
                        variant="h5"
                        align="center"
                        style={{
                          //textDecoration: 'underline'
                        }}
                      >
                        {day.toLocaleString('default', { month: 'short' })}
                      </Typography>
                    </Grid>
                  );
                }
                return <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}></Grid>;
              })}
            </Grid>

            <Grid container spacing={1} id="days">
              {days.slice(startIndex, startIndex + 7).map((day, index) => (
                <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
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
    </>
  );
};

export default Calendar;