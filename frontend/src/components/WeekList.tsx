import React from 'react';
import { useState, setState, useRef } from 'react';

import AppBar from "@mui/material/AppBar";
import { Grid, Box, Typography, Button, Toolbar, TextField, GlobalStyles } from "@mui/material";
import { WorkBlock } from './WorkBlock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const WeekList = ({ workData, selectedWeekDateRange, selectedWeekDays, workDataAggregator, selectedUser, setCalendarMode, }) => {

  const [signedName, setSignedName] = useState('');
  const [fileName, setFileName] = useState('');
  const handleSignatureChange = (event) => {
    setSignedName(event.target.value);
  }
  const reportDownloadAnchor = useRef(null);

  async function fetchReportBlob(signedName) {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/reports/weekly/generate`, {
        method: 'POST',
        body: JSON.stringify({
          employeeId: selectedUser.id,
          from: selectedWeekDateRange.from.toString(),
          to: selectedWeekDateRange.to.toString(),
          fullName: signedName,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const blob = await response.blob();
      const reportFileFormat = '.pdf';
      const fileName = response.headers.get('X-File-Name') || 'timesheet' + reportFileFormat;
      setFileName(fileName);
      const blobUrl = URL.createObjectURL(blob);

      if (reportDownloadAnchor.current) {
        reportDownloadAnchor.current.href = blobUrl;
        reportDownloadAnchor.current.download = fileName;
        reportDownloadAnchor.current.click();
      }
    }

    catch (error) {
      console.error('Error generating report', error);
    }
  }


  return (
    <Grid
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      <GlobalStyles
        styles={{
          '*': { boxSizing: 'border-box' },
          body: {
            padding: '0 !important',
            margin: '0 !important'
          },
        }}
      />
      <AppBar key="header"
        position="sticky"
        sx={{
          width: 'calc(100vw)',
          left: 'calc(50% - 50vw)',
          mt: 0,
          padding: '0.5em',
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">
              Timesheet
            </Typography>
            <Typography variant="h5">
              {
                selectedWeekDateRange.from.toLocaleString('en-US', {
                  weekDay: 'short',
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })
              } <br />—
              {
                selectedWeekDateRange.to.toLocaleString('en-US', {
                  weekDay: 'short',
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}
            </Typography>
          </Box>
          <Button
            color="inherit"
            onClick={() => setCalendarMode(true)}
            sx={{
              ml: 'auto',
              borderRadius: '50%',
              width: '4em',
              height: '4em',
              minHeight: '4em',
              minWidth: '4em',
              maxHeight: '4em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            variant="outlined"
          >
            <CalendarMonthIcon sx={{ fontSize: '2em' }} />
          </Button>
        </Toolbar>
      </AppBar>

      <Box key="data"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.5em',
          borderBottom: '1px solid #ccc',
        }}
      >
        {
          workData
            .filter(
              workData => (
                selectedWeekDays.some((x) => x.equals(workData.date))
              )
            )
            .map((day) => (
              <Box
                key={day.date.toString()}
                sx={{
                  marginBottom: '1em',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant='h6' sx={{ textAlign: 'left' }}>
                    <b>
                      {
                        day.date.toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric'
                        })
                      }
                    </b>
                  </Typography>
                  <Typography
                    variant='h6'
                    sx={{
                      fontStyle: 'italic',
                    }}>
                    Total: <b>{workDataAggregator.getDayWorkHoursTotal(day.date)}h</b>
                  </Typography>
                </Box>

                <Box>
                  {
                    day.workBlocks.length > 0 ?
                      day.workBlocks
                        .map(
                          (workBlock) => (
                            <WorkBlock {...workBlock} editMode={false} key={workBlock.workBlockId} />
                          ))
                      :
                      ''
                  }
                </Box>

              </Box>
            ))
        }
      </Box>

      <Box key='weekTotal'
        sx={{
          display: 'flex',
          justifyContent: 'right',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.5em',
          borderBottom: '1px solid #ccc',
        }}>
        <Typography variant='h6' sx={{
          boxSizing: 'border-box',
          paddingBottom: '1em',
          textDecoration: 'underline',
          textUnderlineOffset: '0.2em',
        }}>
          Week total: <b>{workDataAggregator.getWeekWorkHoursTotal()}h</b>
        </Typography>
      </Box>

      <Box key='sign'
        sx={{
          display: 'flex',
          padding: '1em 1em 3em 1em',
          marginBottom: '1em',
        }}>

        <Box
          sx={{
            border: '1px solid grey',
            borderRadius: '0.5em',
            padding: '1.5em 1em',
          }}>
          <Typography sx={{
            fontStyle: 'oblique',
            fontWeight: 'normal',
            marginBottom: '1.3em',
            fontFamily: 'Georgia',
            fontSize: '1em',
          }}>
            By signing this timesheet, I certify that above is an accurate reflection of all hours worked and not worked during the indicated time period.
          </Typography>

          <Box component="form"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextField
              value={signedName}
              onChange={handleSignatureChange}
              sx={{}}
              placeholder='Enter your full name'
              inputProps={{
                autoComplete: 'off'
              }}
            ></TextField>
            <Button
              variant='contained'
              disabled={signedName.length < 1}
              sx={{
                marginLeft: '1em',
              }}
              onClick={() => fetchReportBlob(signedName)}
            >
              Sign & download
            </Button>
          </Box>
        </Box>

        <a style={{ display: 'none' }} ref={reportDownloadAnchor} title="Download your timesheet"></a>

      </Box>
    </Grid >
  );
}

export default WeekList;
