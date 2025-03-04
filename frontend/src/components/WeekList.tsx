import React from 'react';
import { useState, setState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';

import AppBar from "@mui/material/AppBar";
import { Grid, Box, Typography, Button, Toolbar, GlobalStyles } from "@mui/material";
import { WorkBlock } from './WorkBlock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const WeekList = ({ workData, selectedWeekDateRange, selectedWeekDays, workDataAggregator, selectedUser, setCalendarMode, }) => {

  const reportFormats = ['.docx', '.pdf'];
  const [isSigned, setIsSigned] = useState(false);
  const [reports, setReports] = useState([]);

  const reportDownloadAnchor = useRef(null);
  const downloadsBoxRef = useRef(null);

  const theme = useTheme();

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
      body: JSON.stringify({
        employeeId: selectedUser.id,
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

    return { fileName, blobUrl, format };
  }

  async function handleReportSigning() {
    try {
      setIsSigned(true);
      setTimeout(() => scrollToDownloads(), 400);
      fetchReports();
    }

    catch (error) {
      console.error('Error generating report', error);
    }
  }

  function scrollToDownloads() {
    downloadsBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          '@import': "url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap')",
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
          padding: '0.7em 0.5em 0.4em 0.5em',
          background: '#f5f5f5',
          color: theme.palette.primary.main,
        }}
      >
        <Toolbar>

          <Box sx={{
            flexGrow: 1
          }}>
            <Typography variant="h5" sx={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}>
              Timesheet
            </Typography>
            <Typography variant="h6">
              {
                selectedWeekDateRange.from.toLocaleString('en-US', {
                  weekDay: 'short',
                  month: 'short',
                  day: '2-digit',
                })
              } —
              {
                selectedWeekDateRange.to.toLocaleString('en-US', {
                  weekDay: 'short',
                  month: 'short',
                  day: '2-digit',
                })}
            </Typography>
          </Box>

          <Button
            color="inherit"
            onClick={() => setCalendarMode(true)}
            sx={{
              ml: 'auto',
              borderRadius: '50%',
              borderWidth: '2px',
              width: '4em',
              height: '4em',
              minHeight: '4em',
              minWidth: '4em',
              maxHeight: '4em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
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

          padding: '0 1.2em',
          background: '#f5f5f5',
          borderTop: '1px solid #bbb',
          borderBottom: '1px solid #bbb',
        }}>

        <Box
          sx={{
            // border: '1px solid grey',
            borderRadius: '0.5em',
            padding: '1.5em 0.3em',
          }}>
          <Typography
            sx={{
              fontStyle: 'oblique',
              fontWeight: 'normal',
              marginBottom: '0em',
              fontFamily: 'Georgia',
              fontSize: '1.1em',
              borderLeft: `1px solid ${theme.palette.primary.dark}`,
              padding: '0.6em 0 0.7em 2em',
              color: 'black',
              width: '100%',
            }}>
            By signing this timesheet I, <br /><b>{selectedUser.name || 'NAME MISSING'}</b>,<br /> certify that above is an accurate reflection of all hours worked and not worked during the indicated time period.
          </Typography>

          <Box component="form"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
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
              >
                Sign Timesheet
              </Button>
              :
              <Typography sx={{
                fontFamily: 'Great Vibes, Brush Script MT, cursive',
                fontSize: '2.5em',
                fontStyle: 'italic',
                borderBottom: '1px solid black',
                padding: '0 0.5em',
              }}>
                {selectedUser.name || 'NAME MISSING'}
              </Typography>
            }


          </Box>
        </Box>

        <a style={{
          display: 'none'
        }} ref={reportDownloadAnchor} title="Download your timesheet"></a>

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
            }}>
              <a href={reports
                .find(x => x.format === '.pdf')?.reportDocument.blobUrl ?? null}
                download={reports
                  .find(x => x.format === '.pdf')?.reportDocument.fileName ?? null}>
                .pdf
              </a>
            </Button>
            <Button variant='contained'>
              <a href={reports
                .find(x => x.format === '.docx')?.reportDocument.blobUrl ?? null}
                download={reports
                  .find(x => x.format === '.docx')?.reportDocument.fileName ?? null}>
                .docx
              </a>
            </Button>

          </Typography>
        </Box>
      }

    </Grid >
  );
}

export default WeekList;
