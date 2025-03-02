import { Temporal } from '@js-temporal/polyfill';
import { useState, useEffect } from 'react';
import { Typography, Box, GlobalStyles } from '@mui/material';
import { differenceInHours } from 'date-fns';
import { startOfWeek } from '../utils/temporalFunctions.ts';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { TextField, Autocomplete } from '@mui/material';

import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CompressIcon from '@mui/icons-material/Compress';

import Calendar from '../components/Calendar.tsx';
import WeekList from '../components/WeekList.tsx';
import AddWorkBlockForm from '../components/AddWorkBlock.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';
import HoursTotal from '../components/WorkDay/HoursTotal.tsx';
import fetchTimesheetData from '../utils/fetchTimesheetData.ts';

const TimesheetPage = ({ selectedUser }) => {
  const [isLoading, setisLoading] = useState(false);

  const [dateRange, setDateRange] = useState(generateDateRange());
  const [workData, setWorkData] = useState(scaffoldWorkDataContainer());

  const [selectedDates, setSelectedDates] = useState([]);
  const [lastSelectedSingleDate, setLastSelectedSingleDate] = useState(Temporal.Now.plainDateISO());

  const [calendarMode, setCalendarMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [multiDaySelectionMode, setMultiDaySelectionMode] = useState(false);

  const [jobsiteSearchResults, setJobsiteSearchResults] = useState([]);
  const [selectedJobsiteData, setSelectedJobsiteData] = useState(null);

  const today = Temporal.Now.plainDateISO();

  useEffect(() => {
    dateSelectionHandler.selectSingleDay(today);
    const fetchFullData = async () => (await fetchFullTimesheetData());
    fetchFullData();
  }, []);

  const theme = useTheme();

  function scaffoldWorkDataContainer() {
    const days = [];
    let curr = dateRange.from;
    while (Temporal.PlainDate.compare(curr, dateRange.to) <= 0) {
      const day = curr;
      days.push({ date: day, workBlocks: [] });
      curr = curr.add({ days: 1 });
    }
    return days;
  }

  const fetchFullTimesheetData = async () => {
    const fetchedData = await fetchTimesheetData({ from: dateRange.from, to: today, userId: selectedUser.id });

    updateWorkData(fetchedData);
  };

  const fetchDayTimesheetData = async (date) => {
    const fetchedData = await fetchTimesheetData({ from: date, to: date, userId: selectedUser.id });

    updateWorkData(fetchedData);
  }

  const fetchMultipleDaysTimesheetData = async (dates) => {
    let combinedData = [];
    try {
      for (const date of dates) {
        const fetchedData = await fetchTimesheetData({ from: date, to: date, userId: selectedUser.id });
        combinedData = combinedData.concat(fetchedData);
      }
    }
    catch (error) {
      console.log(error);
    }
    updateWorkData(combinedData);
  }

  const updateWorkData = (newWorkData) => {
    setWorkData((prevWorkData) => (
      prevWorkData.map((prevWorkDay) => {
        const matchingFetchedDay = newWorkData.find((fetchedDay) => ((fetchedDay.date).equals(prevWorkDay.date)));
        if (matchingFetchedDay !== undefined) {
          return matchingFetchedDay;
        } else return prevWorkDay;
      })
    ));

  }

  function generateDateRange(numberOfWeeks = 2) {

    const today = Temporal.Now.plainDateISO();
    const firstWeekStart = startOfWeek(today).subtract({ days: 7 * (numberOfWeeks - 1) });
    const lastWeekEnd = firstWeekStart.add({ days: 7 * numberOfWeeks - 1 });

    return { from: firstWeekStart, to: lastWeekEnd };
  }

  const handleAddWorkBlock = async (workBlockData) => {
    try {
      if (selectedDates.length > 1) {
        await Promise.all(selectedDates.map(date => addWorkBlock(workBlockData, date)));
        await fetchMultipleDaysTimesheetData(selectedDates);
      }
      if (selectedDates.length === 1) {
        await addWorkBlock(workBlockData, selectedDates[0]);
        await fetchDayTimesheetData(selectedDates[0]);
      }
      else if (selectedDates.length === 0) {
        throw new Error();
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
          startTime: workBlockData.workBlockStart ? selectedDate.toString() + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null,
          endTime: workBlockData.workBlockEnd ? selectedDate.toString() + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null,
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
              startTime: workBlockData.workBlockStart ? lastSelectedSingleDate.toString() + "T" + workBlockData.workBlockStart.toString() + ".000Z" : null,
              endTime: workBlockData.workBlockEnd ? lastSelectedSingleDate.toString() + "T" + workBlockData.workBlockEnd.toString() + ".000Z" : null,
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
      await fetchDayTimesheetData(lastSelectedSingleDate);
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
      await fetchDayTimesheetData(lastSelectedSingleDate);
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
      setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
    },
    remove: function (date) {
      setSelectedDates((prevSelectedDates) => prevSelectedDates.filter((d) => !d.equals(date)));
    },
    selectSingleDay: async function (date) {
      setLastSelectedSingleDate(date);
      await fetchDayTimesheetData(lastSelectedSingleDate);
      setSelectedDates([date]);
      setEditMode(false);
      setAddMode(false);
    },
    lastSelectedSingleDate: lastSelectedSingleDate,
    isSelected: function (date) {
      return selectedDates.some((x) => (x.equals(date)));
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

  function getRangeOfSelectedWeek() {
    const selectedWeekNumber = Math.floor((dateRange.from)
      .until(
        dateSelectionHandler.lastSelectedSingleDate,
        { largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc' }
      ).days
      / 7);
    const selectedWeekStartPosition = selectedWeekNumber * 7;
    const startDay = dateRange.from.add({ days: selectedWeekStartPosition });
    const endDay = startDay.add({ days: 6 });

    return { from: startDay, to: endDay };
  }
  function getDaysOfSelectedWeek() {
    const selectedWeekNumber = Math.floor((dateRange.from)
      .until(
        dateSelectionHandler.lastSelectedSingleDate,
        {
          largestUnit: 'days', smallestUnit: 'days', roundingMode: 'trunc'
        }
      ).days / 7);

    const daysOfSelectedWeek = [];
    const selectedWeekStartPosition = selectedWeekNumber * 7;
    for (let i = 0; i <= 6; i++) {
      const day = dateRange.from.add({ days: selectedWeekStartPosition + i });
      daysOfSelectedWeek.push(day);
    }

    return daysOfSelectedWeek;
  }

  const workDataAggregator = {
    getWeekWorkHoursTotal: function () {
      const daysOfSelectedWeek = getDaysOfSelectedWeek();

      return daysOfSelectedWeek.map(
        (day) => {
          return this.getDayWorkHoursTotal(day);
        }).reduce((acc, curr) => acc + curr, 0);
    },

    getDayWorkHoursTotal: function (day) {

      const workDay = workData.find((workDay) => (workDay.date).equals(day));
      if (!workDay) {
        throw new RangeError('Day not found');
      }

      return workDay.workBlocks
        .map(workBlock => {
          if (workBlock.workBlockStart && workBlock.workBlockEnd) {
            return Math.round(((workBlock.workBlockStart).until(workBlock.workBlockEnd).total({ unit: 'hour' })) * 10) / 10;
          }
          return 0;
        })
        .reduce(
          (acc, curr) => acc + curr, 0)
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

  const currentDayWorkData = lastSelectedSingleDate ? workData.find((day) => (day.date).equals(lastSelectedSingleDate))?.workBlocks || [] : [];

  return (
    calendarMode ?
      (
        <Box sx={{
          flex: 1,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          margin: 0
        }}>
          <Calendar {...{
            multiDaySelectionMode, dateRange, workData, dateSelectionHandler, workDataAggregator, setCalendarMode,
          }}
          >
          </Calendar>

          <Grid name='buttons'
            container
            spacing={0}
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              boxSizing: 'border-box',

              gap: 1,
              paddingTop: 1,
              paddingLeft: 0,
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
                    (currentDayWorkData != null && currentDayWorkData.length > 0) &&
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
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        }
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
      )
      :
      (
        !calendarMode &&
        <WeekList {...
          {
            workData, selectedWeekDateRange: getRangeOfSelectedWeek(),
            selectedWeekDays: getDaysOfSelectedWeek(), workDataAggregator,
            selectedUser, setCalendarMode
          }} />
      )
  );
}
export default TimesheetPage;