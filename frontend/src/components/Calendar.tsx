import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { startOfWeek, startOfDay, addDays, isSameDay } from 'date-fns';
import { GlobalStyles } from '@mui/material';
import { capitalize } from 'lodash/capitalize';

const Calendar = () => {
  const today = new Date();
  const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7);
  const days = Array.from({ length: 14 }).map((_, index) => addDays(lastWeekStart, index));

  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(today)); //check for bugs and possible need for additional updates
  const handleDateClick = (date: Date) => {
    return setSelectedDate(date);
  }
  return (
    <>
      <GlobalStyles styles={{ body: { placeItems: 'start' } }} />
      <Grid container spacing={2}>
        <Grid container item xs={12} key="dayNames">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
            <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h6" align="center">{day}</Typography>
            </Grid>
          ))}
        </Grid>

        {[0, 7].map((startIndex) => (
          <Grid container item xs={12} key={startIndex}>
            <Grid container spacing={1} key="month-header">
              {days.slice(startIndex, startIndex + 7).map((day, index) => {
                if (isSameDay(day, lastWeekStart) || day.getDate() === 1) {
                  return (
                    <Grid item xs={1.71} sm={1.71} key={index} style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
                      <Typography variant="h6" align="center">{day.toLocaleString('default', { month: 'short' })}</Typography>
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
                      backgroundColor: isSameDay(day, selectedDate) ? 'lightcoral' : 'transparent'
                    }}
                    onClick={() => handleDateClick(day)}>

                    {day.toLocaleString('default', { day: 'numeric' })}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Calendar;