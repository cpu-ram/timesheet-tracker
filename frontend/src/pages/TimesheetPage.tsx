import { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { startOfDay, format } from 'date-fns';
import { capitalize } from 'lodash';
import Calendar from '../components/Calendar.tsx';
import WorkDay from '../components/WorkDay.tsx';
import AddWorkBlockForm from '../components/AddWorkBlock.tsx';
import fetchTimesheetData from '../utils/fetchTimesheetData.ts';


const TimesheetPage = ({ selectedUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(new Date()));
  const [workData, setWorkData] = useState([]);

  const handleAddWorkBlock = async (workBlockData) => {
    event.preventDefault();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${baseUrl}/workBlocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedUser.id,
          reportedById: selectedUser.id,
          startTime: workBlockData.startTime ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.startTime.toString() + ".000Z" : null,
          endTime: workBlockData.endTime ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.endTime.toString() + ".000Z" : null,
          date: selectedDate
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit work block');
      }
    }
    catch (error) {
      throw new Error(error);
    }
  }


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

      <Calendar {...{ selectedDate, setSelectedDate }}>
      </Calendar>

      <AddWorkBlockForm {...{ handleAddWorkBlock }}></AddWorkBlockForm>
      <WorkDay {...{ workData, selectedDate }}>
      </WorkDay>

    </div>
  )
}

export default TimesheetPage;
