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

  /*const fetchTimesheetData = async (dateString) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const timesheetDataSubPath = '/reports/weekly/data';

    try {
      const response = await fetch(`${baseUrl}${timesheetDataSubPath}?employeeId=${selectedUser.id}&from=${dateString}&to=${dateString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timesheet data');
      }
      const data = await response.json();

      const modifiedData =
        data ?
          data.map((workBlock) => (
            {
              ...workBlock,
              workBlockStart:
                workBlock.workBlockStart ? new Date(workBlock.workBlockStart) : null,
              workBlockEnd:
                workBlock.workBlockEnd ? new Date(workBlock.workBlockEnd) : null,
              breakStart:
                workBlock.breakStart ? new Date(workBlock.breakStart) : null,
              breakEnd:
                workBlock.breakEnd ? new Date(workBlock.breakEnd) : null
            }
          ))
          :
          null;
      setWorkData(modifiedData);
    }
    catch (error) {
      throw new Error(error);
    }
  }
  */


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
