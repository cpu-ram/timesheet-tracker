import { Grid, Typography } from '@mui/material';
import { startOfWeek, addDays } from 'date-fns';

const Calendar = () => {
  const today = new Date();
  const lastWeekStart = addDays(startOfWeek(today), -7);
  const days = Array.from({ length: 14 }).map((_, index) => addDays(lastWeekStart, index));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} key="month-1">
        <Typography>
          {
            lastWeekStart.toLocaleString('default', { month: 'short' })
          }
        </Typography>
      </Grid>
      {[0, 7].map((startIndex) => (
        <Grid item xs='12' key={startIndex}>
          <Grid container spacing={1}>
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