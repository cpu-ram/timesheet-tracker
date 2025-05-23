import React, { useEffect, useState, useRef } from 'react';

import { useTheme } from '@mui/material/styles';
import { useTimesheetContext } from '../contexts/TimesheetContext.tsx';
import { useAuthContext } from '../contexts/AuthContext.tsx';

import { Grid, Box, Typography, Button, AppBar, Toolbar, GlobalStyles } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';

import Navigation from '../components/Navigation/Navigation.tsx';
import { WorkBlock } from '../components/WorkBlock/WorkBlock.tsx';

const ReportPage = () => {

  const {
    workData, setCalendarMode,
    workDataAggregator,
    getDaysOfSelectedWeek,
    getRangeOfSelectedWeek,
  } = useTimesheetContext();

  const { username } = useAuthContext();

  const selectedWeekDays = getDaysOfSelectedWeek();
  const selectedWeekDateRange = getRangeOfSelectedWeek();

  const reportFormats = ['.docx', '.pdf'];
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const [isSigned, setIsSigned] = useState(false);
  const [reports, setReports] = useState(
    reportFormats.map(format => ({
      format, reportDocument: null
    }))
  );

  const downloadsBoxRef = useRef(null);

  const theme = useTheme();

  useEffect(() => {
    fetchReports();
  }, [])

  async function fetchReports() {
    try {
      const accumulator = [];
      for (const format of reportFormats) {
        accumulator.push({ format, reportDocument: await fetchReport(format) });
      }
      setReports(accumulator);
    } catch (error) {
      console.error('Error generating report(s)', error);
    }
  }

  async function fetchReport(format) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/reports/weekly/generate`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        from: selectedWeekDateRange.from.toString(),
        to: selectedWeekDateRange.to.toString(),
        format: format,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    const blob = await response.blob();

    const fileName = response.headers.get('X-File-Name') || 'timesheet' + format;
    const blobUrl = URL.createObjectURL(blob);

    return { fileName, blobUrl };
  }

  async function handleReportSigning() {
    try {
      setIsSigned(true);
      setTimeout(() => scrollToDownloads(), 400);
    }

    catch (error) {
      console.error('Error generating report', error);
    }
  }

  function scrollToDownloads() {
    downloadsBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }


  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          * {
            boxSizing: border-box; 
          }
          body {
            padding: '0 1.5em !important';
            margin: '0 !important;
            }
        `}
      </style>
      <Navigation
        resourceNameList={['timesheet']}
      />

      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '4.5em 0 0 0',
          boxSizing: 'border-box',
          width: 'calc(100vw)',
          left: '0',
        }}
      >

        <Box key="dataWrapper"
          sx={{
            maxWidth: '45em',
            alignSelf: 'center',
          }}>

          <Box key='title'
            sx={{
              display: 'flex',
              alignSelf: 'left',
              flexGrow: 1,
              paddingLeft: 0,
              marginBottom: '1em',
              borderBottom: '1px solid #ccc',
            }}>

            <Typography variant="h5"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Roboto',
                letterSpacing: '0',
                paddingLeft: '0.5em',
              }}>
              {
                selectedWeekDateRange.from.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: '2-digit',
                })
              }—{
                selectedWeekDateRange.to.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: '2-digit',
                })}
            </Typography>
          </Box>


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
                      <Typography variant='h7' sx={{ textAlign: 'left' }}>
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
                        variant='h7'
                        sx={{
                          fontStyle: 'italic',
                          paddingLeft: '1em',
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
            }}>
            <Typography variant='h7' sx={{
              boxSizing: 'border-box',
              paddingBottom: '1em',
              textDecoration: 'underline',
              textUnderlineOffset: '0.4npem',
            }}>
              Week Total: <b>{workDataAggregator.getWeekWorkHoursTotal()}h</b>
            </Typography>
          </Box>
        </Box>

        <Box key='sign'
          sx={{
            display: 'flex',
            width: '100%',

            padding: '1em 1.2em',
            background: '#f5f5f5',
            borderTop: '1px solid #bbb',
            borderBottom: '1px solid #bbb',

            justifyContent: 'center',
            alignItems: 'center',
          }}>

          <Box
            sx={{
              borderLeft: `1px solid ${theme.palette.primary.dark}`,
              padding: '0.8em 0.3em',
              maxWidth: '45em',
              alignSelf: 'center',
            }}>
            <Typography
              sx={{
                fontStyle: 'oblique',
                fontWeight: 'normal',
                marginBottom: '0em',
                fontFamily: 'Georgia',
                fontSize: '1.1em',
                padding: '0.6em 0 0.7em 2em',
                color: 'black',
                width: '100%',
              }}>
              By signing this timesheet I,
              <br /><b>{username}</b>,<br />
              certify that above is an accurate reflection of all hours worked and not worked during the indicated time period.
            </Typography>

            <Box component="form"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'left',
                marginLeft: '2em',
              }}>

              {!isSigned ?
                <Button
                  variant='contained'
                  sx={{
                    fontStyle: 'normal',
                    fontFamily: 'Helvetica, Arial',
                    fontWeight: 'normal',
                    fontSize: '0.9em',
                    border: '1px solid {theme.palette.primary.main}',
                    color: 'white',
                    backgroundColor: theme.palette.primary.main,
                  }}
                  onClick={() => handleReportSigning()}
                  startIcon={<EditIcon />}
                >
                  Sign
                </Button>
                :
                <Typography sx={{
                  fontFamily: 'Great Vibes, Brush Script MT, cursive',
                  fontSize: '2.5em',
                  fontStyle: 'italic',
                  borderBottom: '1px solid black',
                  padding: '0 0.5em',
                }}>
                  {username}
                </Typography>
              }


            </Box>
          </Box>


        </Box>

        {isSigned &&
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '1em 1em',
            }}>


            <Typography
              ref={downloadsBoxRef}
              sx={{
                margin: 0,
                padding: '0.5em 0 1em 0',
                display: 'flex',
                fontSize: '1.2em',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                'a': {
                  color: 'white',
                }
              }}
            >
              Download:
              <Button variant='contained' sx={{
                margin: '0 0.5em',
              }}
                disabled={!reports.find(x => x.format === '.pdf').reportDocument}
              >
                <a href={reports
                  .find(x => x.format === '.pdf').reportDocument?.blobUrl ?? null}
                  download={reports
                    .find(x => x.format === '.pdf').reportDocument?.fileName ?? null}>
                  .pdf
                </a>
                {!reports.find(x => x.format === '.docx').reportDocument &&
                  <CircularProgress size={20} thickness={6}
                    sx={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-0.8em',
                    }}
                  />}
              </Button>
              <Button variant='contained'
                disabled={!reports.find(x => x.format === '.docx').reportDocument}
              >
                <a href={reports
                  .find(x => x.format === '.docx').reportDocument?.blobUrl ?? null}
                  download={reports
                    .find(x => x.format === '.docx').reportDocument?.fileName ?? null}>
                  .docx
                </a>
                {!reports.find(x => x.format === '.docx').reportDocument &&
                  <CircularProgress size={20} thickness={6}
                    sx={{
                      alignContent: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      left: '50%',
                      marginLeft: '-0.8em',
                    }}
                  />}
              </Button>

            </Typography>
          </Box>
        }

      </Grid >
    </>
  );
}

export default ReportPage;
