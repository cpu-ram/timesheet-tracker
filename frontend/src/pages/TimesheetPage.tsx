import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';

import { Temporal } from '@js-temporal/polyfill';
import { startOfWeek } from '../utils/temporalFunctions.ts';

import { Box, Container, AppBar, Toolbar, IconButton, Grid } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import MenuIcon from '@mui/icons-material/Menu';

import Navigation from '../components/Navigation/Navigation.tsx';
import HeaderNav from '../components/HeaderNav/HeaderNav.tsx';
import SideMenu from '../components/SideMenu/SideMenu.tsx';

import Buttons from '../components/TimesheetPage/Buttons.jsx';
import Calendar from '../components/Calendar.tsx';
import ReportPage from './ReportPage.tsx';
import AddWorkBlockForm from '../components/AddWorkBlock.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';
import HoursTotal from '../components/WorkDay/HoursTotal.tsx';

import fetchTimesheetData from '../utils/fetchTimesheetData.ts';
import updateWorkData from '../utils/updateWorkData.ts';

const TimesheetPage = () => {
  const navigate = useNavigate();

  const {
    dateRange, setDateRange,
    workData, setWorkData,
    multiDaySelectionMode, setMultiDaySelectionMode,
    selectedDates, setSelectedDates,
    editMode, setEditMode,
    addMode, setAddMode,
    lastSelectedSingleDate, setLastSelectedSingleDate,
    dateSelectionHandler,
    calendarMode, setCalendarMode,
    getDaysOfSelectedWeek,
    workDataAggregator,
    getRangeOfSelectedWeek,
    fetchFullTimesheetData,
  } = useTimesheetContext();


  const [jobsiteSearchResults, setJobsiteSearchResults] = useState([]);
  const [selectedJobsiteData, setSelectedJobsiteData] = useState(null);

  const today = Temporal.Now.plainDateISO();


  const theme = useTheme();


  const fetchDayTimesheetData = async (date) => {
    const fetchedData = await fetchTimesheetData({ from: date, to: date });
    updateWorkData(fetchedData, setWorkData);
  }

  const fetchMultipleDaysTimesheetData = async (dates) => {
    let combinedData = [];
    try {
      for (const date of dates) {
        const fetchedData = await fetchTimesheetData({ from: date, to: date });
        combinedData = combinedData.concat(fetchedData);
      }
    }
    catch (error) {
      console.log(error);
    }
    updateWorkData(combinedData, setWorkData);
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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
          credentials: 'include',
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
        credentials: 'include',
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
      const response = await fetch(`${baseUrl}/jobsites?query=${query}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
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
      const response = await fetch(`${baseUrl}/jobsites/${jobsiteId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const responseData = await response.json();
      setSelectedJobsiteData(responseData);
    } catch (error) {
      console.error('Error fetching job site data:', error);
      setSelectedJobsiteData(null);
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
    <>

      <Navigation
        resourceNameList={['weekly_report']}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',

          padding: '3.5em 0.5em',
          margin: 0,
        }}>

        <Container
          sx={{
            width: 'auto',
            alignSelf: 'center',
            maxWidth: '35em',
          }}>

          <Calendar></Calendar>

          <Buttons {...{
            theme,
            editMode, addMode,
            handleSetAddMode, handleSetEditMode, handleDiscard,
            handleSearchJobsites, handleFetchJobsiteData, handleCancelEdit, jobsiteSearchResults,
            currentDayWorkData
          }}>
          </Buttons>

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
        </Container>
      </Box >
    </>
  );
}
export default TimesheetPage;