import { useEffect } from 'react';
import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';
import { useStyleContext } from '../contexts/StyleContext.tsx';
import { useNotificationContext } from '../contexts/NotificationContext.tsx';
import { usePopupContext } from '../contexts/PopupContext.tsx';


import { Box, Grid, Typography } from '@mui/material';

import Navigation from '../components/Navigation/Navigation.tsx';

import Buttons from '../components/TimesheetPage/Buttons';
import Calendar from '../components/Calendar.tsx';
import WorkBlockEntryForm from '../components/WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';

import { TimesheetDayRecord } from '../types/TimesheetDayRecord.ts';

const TimesheetPage = () => {
  const { theme } = useStyleContext();
  const { showPopup, hidePopup } = usePopupContext();

  const {
    workData,
    timesheetPageMode,
    setTimesheetPageMode,
    lastSelectedSingleDate,
    handleDiscard,
  } = useTimesheetContext();

  const { notification } = useNotificationContext();

  const handleCancelEdit = function () {
    setTimesheetPageMode('view');
  };

  const currentDayWorkData = lastSelectedSingleDate
    ? workData.find((day: TimesheetDayRecord) => day.date.equals(lastSelectedSingleDate))
      ?.workBlocks || []
    : [];

  useEffect(() => {
    const ua = navigator.userAgent;
    const isMobileChrome = /(Chrome|CriOS)/.test(ua) && /(Mobile|Android|iPhone|iPad)/.test(ua);
    if (!isMobileChrome) return;

    if (timesheetPageMode !== 'view') {
      const nudge = () => {
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
      };
      window.addEventListener('focusin', nudge, true);
      const t = setTimeout(nudge, 150);
      return () => {
        window.removeEventListener('focusin', nudge, true);
        clearTimeout(t);
      };
    }
  }, [timesheetPageMode]);

  return (
    <>
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
          boxSizing: 'border-box',

          backgroundColor: theme.palette.grey[100],
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Navigation resourceNameList={['weekly_report']} />
        <Box
          sx={{
            maxWidth: '45em',
          }}
        >
          <Calendar></Calendar>

          <Buttons
            {...{
              mode: timesheetPageMode,
              setTimesheetPageMode,
              handleDiscard,
              handleCancelEdit,
              currentDayWorkData,
              onAddButtonClick: () => {
                showPopup(
                  <WorkBlockEntryForm
                    mode="add"
                    onDiscard={() => { hidePopup(); }}
                    onSaved={() => { hidePopup(); }}
                  />
                )
              },
            }}
          ></Buttons>

          {notification && (
            <Grid
              item
              xs={12}
              sx={{
                margin: '0.75em 0 0.75em 0',
              }}
            >
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
                  }}
                >
                  {notification}
                </Typography>
              }
            </Grid>
          )}

          <Box
            id="main-content"
            className={timesheetPageMode !== 'view' ? 'no-anchor' : undefined}
            sx={{
              padding: {
                xs: '0 0.5em',
                md: 0,
              },
              marginBottom: '5em',
            }}
          >
            <DayWorkBlocks {
              ...{ workData: currentDayWorkData }
            }
              date={lastSelectedSingleDate}
            ></DayWorkBlocks>

          </Box>
        </Box>
      </Box >
    </>
  );
};
export default TimesheetPage;
