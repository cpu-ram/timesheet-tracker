import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';
import { useStyleContext } from '../contexts/StyleContext.tsx';
import { useNotificationContext } from '../contexts/NotificationContext.tsx';


import { Box, Grid, Typography } from '@mui/material';

import Navigation from '../components/Navigation/Navigation.tsx';

import Buttons from '../components/TimesheetPage/Buttons';
import Calendar from '../components/Calendar.tsx';
import WorkBlockEntryForm from '../components/WorkBlock/WorkBlockEntryForm/WorkBlockEntryForm.tsx';
import DayWorkBlocks from '../components/WorkDay/DayWorkBlocks.tsx';

import { TimesheetDayRecord } from '../types/TimesheetDayRecord.ts';

const TimesheetPage = () => {
  const { theme } = useStyleContext();

  const {
    workData,
    editMode, setEditMode,
    addMode, setAddMode,
    lastSelectedSingleDate,
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
  const currentDayWorkData = lastSelectedSingleDate ? workData.find((day: TimesheetDayRecord) => (day.date).equals(lastSelectedSingleDate))?.workBlocks || [] : [];

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
            },
            marginBottom: '5em',
          }}>
          <Grid id="add-work-block"
            container
            className='addWorkBlock'
            sx={{
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
