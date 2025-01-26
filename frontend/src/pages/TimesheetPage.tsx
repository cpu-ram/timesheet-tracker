import { Temporal } from '@js-temporal/polyfill';
import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { startOfDay, format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { TextField, Autocomplete } from '@mui/material';

import Button from '@mui/material/Button';
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
  const [jobsiteSearchResults, setJobsiteSearchResults] = useState([]);
  const [selectedJobsiteData, setSelectedJobsiteData] = useState(null);
  const theme = useTheme();

  const fetchData = async () => {
    if (selectedDate) {
      const timesheetData = await fetchTimesheetData({ date: selectedDate, userId: selectedUser.id });
      setWorkData(timesheetData || []);
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
  const handleSearchJobsites = async (event, value) => {
    const query = value;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

    if (query.trim() === '') {
      setJobsiteSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/jobsites?query=${query}`);
      const responseData = await response.json();
      const mappedResponseData =
        responseData ?
          responseData.map(jobsite => jobsite)
          :
          null;
      setJobsiteSearchResults(mappedResponseData || []);
    } catch (error) {
      console.error('Error fetching job sites:', error);
      setJobsiteSearchResults([]);
    }
  };
  const handleFetchJobsiteData = async (event, value) => {
    const query = value;
    if (!query) {
      setSelectedJobsiteData(null);
      return;
    }

    const jobsiteId = value.id;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${baseUrl}/jobsites/${jobsiteId}`);
      const responseData = await response.json();
      setSelectedJobsiteData(responseData);
    } catch (error) {
      console.error('Error fetching job site data:', error);
      setSelectedJobsiteData(null);
    }
  }

  const handleSetEditMode = () => {
    setEditMode(true);
    setAddMode(false);
  }
  const handleCancelEdit = () => {
    setEditMode(false);
  }
  const handleSetAddMode = () => {
    setAddMode(true);
    setEditMode(false);
  }
  const handleEraseJobsiteSelection = () => {
    setSelectedJobsiteData(null);
  }
  const handleDiscard = () => {
    setAddMode(false);
    handleEraseJobsiteSelection();
  }


  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedUser])

  return (
    <Box sx={{
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      margin: 0
    }}>
      <Calendar {...{ selectedDate, setSelectedDate }}>
      </Calendar>

      <Grid name='buttons'
        container
        spacing={0}
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 1,
          paddingTop: 1,
          paddingLeft: 1,
        }}>

        {
          (editMode && addMode) ?
            <Typography> Error</Typography>
            :
            <></>
        }

        {
          !addMode && !editMode ?
            <Grid item
              sx={{
                display: 'flex',
                gap: 1,
                padding: 0,
                margin: 0,
              }}>
              <Button
                display='flex'
                onClick={() => handleSetAddMode()}
                variant='outlined'
                sx={{
                  backgroundColor: theme.palette.primary.light,
                  color: 'white',
                }}>
                <AddIcon />
              </Button>

              {
                (workData != null && workData.length > 0) &&
                <Button
                  display='flex'
                  onClick={() => handleSetEditMode()}
                  variant='outlined'
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: 'white'
                  }}
                >
                  <EditIcon />
                </Button>
              }

            </Grid>
            :
            <></>
        }

        {
          addMode ?
            <Box
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                gap: 1,
                padding: 0,
                margin: 0,
              }}>
              <Box
                xs={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: 1,
                  paddingRight: 2,
                  gap: 1,
                }}
                spacing={2}
              >
                <Button
                  onClick={() => handleDiscard()}
                  variant='outlined'
                  display='flex'
                  sx={{
                    backgroundColor: theme.palette.info.dark,
                    color: 'white',
                    margin: 0,
                  }}
                >
                  <CompressIcon />
                </Button>

                <Autocomplete
                  options={jobsiteSearchResults}
                  getOptionLabel={
                    (option) => {
                      return Object.entries(option).map(([key, value]) => {
                        if (value != null) {
                          return (`${key}: ${value}`);
                        }
                      }
                      ).filter((x) => (x != null)).join(', ');
                    }}
                  onInputChange={handleSearchJobsites}
                  onChange={handleFetchJobsiteData}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Search Jobsites"
                      fullWidth
                      sx={{ fontSize: '16px' }}
                    />
                  }
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    fontSize: '16px',
                  }}
                />

              </Box>
            </Box>
            :
            <></>
        }

        {
          editMode ?
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
            :
            <></>
        }
      </Grid >

      <Grid container name='addWorkBlock'>
        {
          addMode &&
          (
            <AddWorkBlockForm {...{
              ...{
                workBlockStart: selectedJobsiteData ? Temporal.PlainTime.from(selectedJobsiteData.defaultWorkStartTime) : null,
                workBlockEnd: selectedJobsiteData ? Temporal.PlainTime.from(selectedJobsiteData.defaultWorkEndTime) : null,
                jobsiteId: selectedJobsiteData ? selectedJobsiteData.jobsiteId : null,
                jobsiteAddress: selectedJobsiteData ? selectedJobsiteData.jobsiteAddress : null,
                jobsiteName: selectedJobsiteData ? selectedJobsiteData.jobsiteName : null,
                supervisorName: selectedJobsiteData ? selectedJobsiteData.supervisorName : null,
              },
              handleEnteredData: handleAddWorkBlock, handleDiscard
            }}>
            </AddWorkBlockForm >
          )
        }
      </Grid>

      <DayWorkBlocks {...{ workData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }}>
      </DayWorkBlocks>
      <HoursTotal {...{ workData }}></HoursTotal>

    </Box >
  );
}


export default TimesheetPage;
