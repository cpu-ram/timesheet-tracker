import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';

import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';
import { useStyleContext } from '../contexts/StyleContext.tsx';
import { useNotificationContext } from '../contexts/NotificationContext.tsx';

import { Temporal } from '@js-temporal/polyfill';
import { startOfWeek } from '../utils/temporalFunctions.ts';

import { Box, Container, AppBar, Toolbar, IconButton, Grid, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import MenuIcon from '@mui/icons-material/Menu';

import Navigation from '../components/Navigation/Navigation.tsx';
import HeaderNav from '../components/HeaderNav/HeaderNav.tsx';
import SideMenu from '../components/SideMenu/SideMenu.tsx';

import Buttons from '../components/TimesheetPage/Buttons';
import Calendar from '../components/Calendar.tsx';
import ReportPage from './ReportPage.tsx';
import WorkBlockEntryForm from '../components/WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';
import HoursTotal from '../components/WorkDay/HoursTotal.tsx';

import fetchTimesheetData from '../api/fetchTimesheetData.ts';
import { addWorkBlock, updateWorkBlock, deleteWorkBlock } from '../api/workBlockApi.ts';
import updateWorkData from '../utils/updateWorkData.ts';

import { AddWorkBlockFormProps, WorkBlockProps, AddWorkBlockFormFlags, AddWorkBlockFormHandlers } from '../components/WorkBlock/types.tsx';

const TimesheetPage = () => {
  const navigate = useNavigate();
  const { theme } = useStyleContext();
  const today = Temporal.Now.plainDateISO();

  const {
    workData, setWorkData,
    multiDaySelectionMode,
    editMode, setEditMode,
    addMode, setAddMode,
    lastSelectedSingleDate,
    dateSelectionHandler,
    fetchDayTimesheetData,
    fetchMultipleDaysTimesheetData,
    handleEditWorkBlock,
    handleDeleteWorkBlock,
    handleDiscard,
  } = useTimesheetContext();

  const { notification } = useNotificationContext();

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
  const currentDayWorkData = lastSelectedSingleDate ? workData.find((day) => (day.date).equals(lastSelectedSingleDate))?.workBlocks || [] : [];

  return (
    <Box
      className="timesheet-page"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: {
          xs: '48px 0 0 0',
        },


        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',


        backgroundColor: theme.palette.grey[100],
      }}>

      <Navigation
        resourceNameList={['weekly_report']}
      />
      <Box
        sx={{
          maxWidth: '45em',
        }}
      >
        <Calendar></Calendar>

        <Buttons {...{
          editMode, addMode,
          handleSetAddMode, handleSetEditMode, handleDiscard,
          handleCancelEdit,
          currentDayWorkData
        }}>
        </Buttons>

        {notification && (
          <Grid item
            xs={12}
            sx={{
              margin: '0.75em 0 0.75em 0',
            }}>
            {
              <Typography
                sx={{
                  padding: '0.5em',
                  border: '1px solid grey',
                  backgroundColor: theme.palette.info.light,
                  color: theme.palette.info.contrastText,
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '1em',
                }}>
                {notification}
              </Typography>
            }
          </Grid>
        )}

        <Box id="main-content"
          sx={{
            padding: {
              xs: '0 0.5em',
              md: 0,
            }
          }}>
          <Grid id="add-work-block"
            container name='addWorkBlock'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0',
              height: 'auto',
              backgroundColor: theme.palette.grey[100],

              borderRadius: '0.7em',
              '& > .work-block-entry-form': {
                borderRadius: '0.7em',
              },
              margin: '0.5em 0',
              border: `1px solid ${theme.palette.divider}`,
              display: addMode ? 'flex' : 'none',
            }}>
            {
              addMode &&
              (
                <WorkBlockEntryForm
                  formFlags={{
                    mode: 'add',
                  }}
                />
              )
            }
          </Grid>

          <DayWorkBlocks {...{ workData: currentDayWorkData }}>
          </DayWorkBlocks>
        </Box>
      </Box>
    </Box>
  );
}
export default TimesheetPage;