import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { startOfDay, format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import Calendar from '../components/Calendar.tsx';
import AddWorkBlockForm from '../components/AddWorkBlock.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';
import HoursTotal from '../components/WorkDay/HoursTotal.tsx';
import fetchTimesheetData from '../utils/fetchTimesheetData.ts';

const TimesheetPage = ({ selectedUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(new Date()));
  const [workData, setWorkData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const theme = useTheme();

  const fetchData = async () => {
    if (selectedDate) {
      const timesheetData = await fetchTimesheetData({ date: selectedDate, userId: selectedUser.id });
      setWorkData(timesheetData);
    }
  };

  const handleAddWorkBlock = async (workBlockData) => {
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
          date: selectedDate,
          tempJobsiteId: workBlockData.jobsiteId,
          tempJobsiteName: workBlockData.jobsiteName,
          tempJobsiteAddress: workBlockData.address
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit work block');
      }
      fetchData();
    }
    catch (error) {
      throw new Error(error);
    }
  }

  const handleDeleteWorkBlock = async (workBlockId) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/workBlocks/${workBlockId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete work block');
      }
      fetchData();
    }
    catch (error) {
      throw new Error(error);
    }
  }

  const handleEditWorkBlock = (() => { });

  const handleSetEditMode = () => {
    setEditMode(true);
  }
  const handleCancelEdit = () => {
    setEditMode(false);
  }
  const handleSetAddMode = () => {
    setAddMode(true);
  }
  const handleDiscard = () => {
    setAddMode(false);
  }


  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedUser])

  return (
    <>
      <Calendar {...{ selectedDate, setSelectedDate }}>
      </Calendar>
      <Box sx={{ pb: 1 }}>
        <Box
          alignItems='center'
          justifyContent='flex-start'
          sx={{ display: 'flex' }}
        >
          <Typography variant='h6' sx={{ pt: 1, pb: 1 }}>
            Workday data
          </Typography>

          {editMode ?
            (<>
              <Button
                onClick={() => handleCancelEdit()}
                sx={{ color: theme.palette.primary, marginLeft: 0.75, fontSize: 12, padding: 0.2 }}
                variant='outlined'
              >
                Done
              </Button>
            </>
            )
            :
            (
              <>
                <IconButton display='flex' onClick={() => handleSetEditMode()}>
                  <EditIcon sx={{ color: editMode ? 'grey' : theme.palette.primary.dark }} />
                </IconButton>
              </>
            )
          }
        </Box>
        {
          addMode ?
            (
              <AddWorkBlockForm {...{ handleEnteredData: handleAddWorkBlock, handleDiscard }}>
              </AddWorkBlockForm >
            )
            :
            (
              <Button onClick={() => handleSetAddMode()} variant='contained' sx={{ bgColor: theme.palette.secondary.light }}>
                <AddIcon />
              </Button>
            )

        }
      </Box >

      <DayWorkBlocks {...{ workData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }}>
      </DayWorkBlocks>
      <HoursTotal {...{ workData }}></HoursTotal>
    </>
  );
}

export default TimesheetPage;
