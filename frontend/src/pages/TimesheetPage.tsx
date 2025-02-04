import { Temporal } from '@js-temporal/polyfill';
import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { startOfDay, startOfWeek, format, addDays, isSameDay } from 'date-fns';
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
  const [isLoading, setisLoading] = useState(false);

  const [workData, setWorkData] = useState([]);
  const [dateRange, setDateRange] = useState(generateDateRange());

  const [selectedDates, setSelectedDates] = useState([]);
  const [lastSelectedSingleDate, setLastSelectedSingleDate] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [multiDaySelectionMode, setMultiDaySelectionMode] = useState(false);

  const [jobsiteSearchResults, setJobsiteSearchResults] = useState([]);
  const [selectedJobsiteData, setSelectedJobsiteData] = useState(null);

  const today = startOfDay(new Date());

  useEffect(() => {
    const fetchFullData = async () => (await fetchFullTimesheetData());
    dateSelectionHandler.selectSingleDay(today);
    fetchFullData();
  }, []);

  useEffect(() => {
    const fetchDayData = async (x) => {
      await fetchDayTimesheetData(x);
    }
    if (!multiDaySelectionMode) {
      setEditMode(false);
      setAddMode(false);
      fetchDayData(lastSelectedSingleDate);
    }
  }, [lastSelectedSingleDate])

  const theme = useTheme();

  const fetchFullTimesheetData = async () => {
    setisLoading(true);

    const timesheetData = await fetchTimesheetData({ from: dateRange.from, to: today, userId: selectedUser.id });
    setWorkData(timesheetData || []);

    setisLoading(false);
  };

  const fetchDayTimesheetData = async (date) => {
    setisLoading(true);

    const timesheetData = await fetchTimesheetData({ from: date, to: date, userId: selectedUser.id });
    setWorkData((workData) => (
      workData && workData.length > 0 ?
        workData.map((day) => (
          isSameDay(day.date, date) ? { ...day, workBlocks: timesheetData[0].workBlocks } : day
        ))
        :
        [{ date: date, workBlocks: timesheetData[0].workBlocks }]
    ));

    setisLoading(false);
  }

  function generateDateRange(numberOfWeeks = 2) {

    const today = startOfDay(new Date());
    const firstWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -(7 * (numberOfWeeks - 1)));
    const lastWeekEnd = addDays(firstWeekStart, 7 * numberOfWeeks - 1);

    return { from: firstWeekStart, to: lastWeekEnd };
  }

  const handleAddWorkBlock = async (workBlockData) => {
    try {
      if (selectedDates.length > 0) {
        await Promise.all(selectedDates.map(date => addWorkBlock(workBlockData, date)));
        await fetchFullTimesheetData();
      }
      setAddMode(false);
    }
    catch (error) {
      throw new Error(error);
    }
  }

  const addWorkBlock = async (workBlockData, selectedDate) => {
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
          additionalNotes: workBlockData.additionalNotes,
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
              startTime: workBlockData.workBlockStart ? format(lastSelectedSingleDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null,
              endTime: workBlockData.workBlockEnd ? format(lastSelectedSingleDate, 'yyyy-MM-dd') + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null,
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
      else await fetchFullTimesheetData();
    }

    catch (error) {
      console.error(error);
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
      else await fetchFullTimesheetData();
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

  const dateSelectionHandler = {
    add: function (date) {
      setSelectedDates(() => [...selectedDates, date]);
    },
    remove: function (date) {
      setSelectedDates(() => selectedDates.filter((d) => !isSameDay(d, date)));
    },
    selectSingleDay: function (date) {
      setSelectedDates([date]);
      setLastSelectedSingleDate(date);
    },
    lastSelectedSingleDate: lastSelectedSingleDate,
    isSelected: function (date) {
      return selectedDates.some((x) => (isSameDay(x, date)));
    },
    multiSelectionOn: function () {
      setMultiDaySelectionMode(true);
    },
    multiSelectionOff: function () {
      setMultiDaySelectionMode(false);
      this.selectSingleDay(lastSelectedSingleDate);
    },
    switch: function () {
      if (multiDaySelectionMode) {
        this.multiSelectionOff();
      }
      else this.multiSelectionOn();
    },
    handleDateClick: function (date: Date) {
      if (!multiDaySelectionMode) {
        dateSelectionHandler.selectSingleDay(date);
      }
      else {
        switch (this.isSelected(date)) {
          case true:
            this.remove(date);
            break;
          case false:
            this.add(date);
            break;
          default:
            break;
        }
      }
    }
  }

  const handleSetEditMode = function () {
    setEditMode(true);
    setAddMode(false);
  }
  const handleCancelEdit = function () {
    setEditMode(false);
  }
  const handleSetAddMode = function () {
    setAddMode(true);
    setEditMode(false);
  }
  const handleDiscard = function () {
    if (multiDaySelectionMode) dateSelectionHandler.multiSelectionOff();
    if (selectedJobsiteData !== null) setSelectedJobsiteData(null);
    if (addMode === true) setAddMode(false);
  }

  const currentDayWorkData = workData.find((day) => isSameDay(day.date, lastSelectedSingleDate))?.workBlocks || [];

  return (
    <Box sx={{
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      margin: 0
    }}>
      <Calendar {...{
        multiDaySelectionMode, dateRange, workData, dateSelectionHandler
      }}>
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
                mode: 'add',
                multiDaySelectionMode, dateSelectionHandler,
              },
              handleEnteredData: handleAddWorkBlock, handleDiscard
            }}>
            </AddWorkBlockForm >
          )
        }
      </Grid>
      <DayWorkBlocks {...{ workData: currentDayWorkData, editMode, handleDeleteWorkBlock, handleEditWorkBlock }}>
      </DayWorkBlocks>
      <HoursTotal {...{ workData: currentDayWorkData }}></HoursTotal>


    </Box >
  );
}


export default TimesheetPage;
