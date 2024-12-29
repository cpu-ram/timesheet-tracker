import { Grid, Typography } from '@mui/material';
import { startOfWeek, addDays, isSameDay } from 'date-fns';

const Calendar = () => {
  const today = new Date();
  const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: '1' }), -7);
  const days = Array.from({ length: 14 }).map((_, index) => addDays(lastWeekStart, index));

  return (
    <Grid container spacing={2}>
      {[0, 7].map((startIndex) => (
        <Grid item xs='12' key={startIndex}>
          <Grid container spacing={1} id='month-header'>
            {days.slice(startIndex, startIndex + 7).map((day, index) => {
              if (isSameDay(day, lastWeekStart) || day.getDate() === 1) {
                return (
                  <Grid item xs='1.5' key={index}>
                    <Typography>{day.toLocaleString('default', { month: 'short' })}</Typography>
                  </Grid>
                )
              }
              return (<Grid item xs='1.5' key={index}></Grid>)
            })}
          </Grid>

          <Grid container spacing={1} id='days'>
            {days.slice(startIndex, startIndex + 7).map((day, index) => (
              <Grid item xs='1.5' key={index}>
                <Typography>{day.toLocaleString('default', { day: 'numeric' })}</Typography>
              </Grid>
            ))}
          </Grid>
        </ Grid>
      ))}
    </Grid>
  );
};

export default Calendar;