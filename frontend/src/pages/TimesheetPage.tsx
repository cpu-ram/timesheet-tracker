import { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { startOfDay, format } from 'date-fns';
import { capitalize } from 'lodash';
import Calendar from '../components/Calendar.tsx';
import WorkDay from '../components/WorkDay.tsx';
import fetchTimesheetData from '../utils/fetchTimesheetData.ts';


const TimesheetPage = ({ selectedUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(new Date()));
  const [workData, setWorkData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDate) {
        const timesheetData = await fetchTimesheetData({ date: selectedDate, userId: selectedUser.id });
        setWorkData(timesheetData);
      }
    };

    fetchData();
  }, [selectedDate, selectedUser])

  return (
    <div>
      Hello, {capitalize(selectedUser.nickname)}
      <Calendar {...{ selectedDate, setSelectedDate }}>
      </Calendar>

      <WorkDay {...{ workData, selectedDate }}>
      </WorkDay>

    </div>
  )
}

export default TimesheetPage;
