import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { startOfDay, format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CompressIcon from '@mui/icons-material/Compress';

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
          startTime: workBlockData.workBlockStart ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null,
          endTime: workBlockData.workBlockEnd ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null,
          date: selectedDate,
          tempJobsiteId: workBlockData.jobsiteId,
          tempJobsiteName: workBlockData.jobsiteName,
          tempJobsiteAddress: workBlockData.jobsiteAddress,
          tempSupervisorName: workBlockData.supervisorName,
          additionalNotes: workBlockData.additionalNotes
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
  const handleEditWorkBlock = async ({ workBlockId, workBlockData }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/workBlocks/${workBlockId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body:
            JSON.stringify({
              workBlockId: workBlockId,
              startTime: workBlockData.workBlockStart ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null,
              endTime: workBlockData.workBlockEnd ? format(selectedDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null,
              tempJobsiteId: workBlockData.jobsiteId,
              tempJobsiteName: workBlockData.jobsiteName,
              tempJobsiteAddress: workBlockData.jobsiteAddress,
              tempSupervisorName: workBlockData.supervisorName,
              additionalNotes: workBlockData.additionalNotes
            })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update work block');
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
          sx={{
            display: 'flex',
            paddingTop: 1,
          }}
        >


          <Box sx={{
            marginLeft: 0.5,
          }}>
            {addMode ?
              (
                <>
                  <Button
                    onClick={() => handleDiscard()}
                    variant='outlined'
                    sx={{
                      backgroundColor: theme.palette.info.dark,
                      color: 'white',
                    }}
                  >
                    <CompressIcon />
                  </Button>
                </>
              )
              :
              (
                <>
                  <Button
                    onClick={() => handleSetAddMode()}
                    variant='outlined'
                    sx={{
                      backgroundColor: theme.palette.info.light,
                      color: 'white',
                    }}>
                    <AddIcon />
                  </Button>
                </>
              )
            }
          </Box>

          <Box sx={{
            marginLeft: 0.75,
          }}>
            {editMode ?
              (<>
                <Button
                  onClick={() => handleCancelEdit()}
                  sx={{
                    color: 'white',
                    backgroundColor: theme.palette.info.dark
                  }}
                  variant='outlined'
                >
                  <Typography variant='h7' sx={{
                    padding: 0,
                    margin: 0,
                  }}>
                    Done
                  </Typography>
                </Button>
              </>
              )

              :

              (
                <>
                  <Button
                    display='flex'
                    onClick={() => handleSetEditMode()}
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                    }}
                  >
                    <EditIcon
                      sx={{
                        padding: 0,
                        margin: 0,
                        fontSize: '1.3rem',
                        color: 'white',
                      }} />
                  </Button>
                </>
              )
            }
          </Box>

        </Box>

        {
          addMode ?
            (
              <AddWorkBlockForm {...{ ...workData, handleEnteredData: handleAddWorkBlock, handleDiscard }}>
              </AddWorkBlockForm>
            )
            :
            (<></>)
        }

        <DayWorkBlocks {...{ workData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }}>
        </DayWorkBlocks>
        <HoursTotal {...{ workData }}></HoursTotal>

      </Box >
    </>
  );
}


export default TimesheetPage;
