import { useEffect, useState, useRef } from 'react';
import {
  getReportPageStyle,
  getMainContentStyle,
  getWeekTitleContainerStyle,
  getWorkDayStyle,
  getWorkDayHeaderStyle,
  getWorkDayDateStyle,
  getWorkDayHoursStyle,
  getWeekTotalStyle,
  getSignBoxStyle,
  getSignedStatementStyle,
  getSignatureStyle,
  getSignButtonStyle,
  getDownloadsBoxStyle,
  getCircularProgressStyle,
  getWorkBlocksWrapperStyle,
} from './styles.ts';

import { useTheme } from '@mui/material/styles';
import { useTimesheetContext } from '../../contexts/TimesheetContext.tsx';
import { useAuthContext } from '../../contexts/AuthContext.tsx';

import { alpha } from '@mui/material/styles';

import { Grid, Box, Typography, Button } from '@mui/material';
import { Temporal } from '@js-temporal/polyfill';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';

import Navigation from '../../components/Navigation/Navigation.tsx';
import { WorkBlock } from '../../components/WorkBlock/WorkBlock.tsx';
import { TimesheetDayRecord } from '../../types/TimesheetDayRecord.ts';

const ReportPage = () => {
  const timesheetContext = useTimesheetContext();
  const workData = timesheetContext.workData;

  const { workDataAggregator, getDaysOfSelectedWeek, getRangeOfSelectedWeek } =
    useTimesheetContext();

  const { username } = useAuthContext();

  const selectedWeekDays = getDaysOfSelectedWeek();
  const selectedWeekDateRange = getRangeOfSelectedWeek();

  const reportFormats = ['.docx'];

  interface Report {
    format: string;
    reportDocument: {
      fileName: string;
      blobUrl: string;
    } | null;
  }

  const [isSigned, setIsSigned] = useState(false);
  const [reports, setReports] = useState<Report[]>(
    reportFormats.map(format => ({
      format,
      reportDocument: null,
    })),
  );

  const downloadsBoxRef = useRef<HTMLElement | null>(null);

  const theme = useTheme();

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports(): Promise<void> {
    try {
      const accumulator: Report[] = [];
      for (const format of reportFormats) {
        accumulator.push({ format, reportDocument: await fetchReport(format) });
      }
      setReports(accumulator);
    } catch (error) {
      console.error('Error generating report(s)', error);
    }
  }

  async function fetchReport(format: string): Promise<{ fileName: string; blobUrl: string }> {
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
      },
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
    } catch (error) {
      console.error('Error generating report', error);
    }
  }

  function scrollToDownloads() {
    downloadsBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  }

  return (
    <Box className="report-page" sx={getReportPageStyle()}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
          * {
            boxSizing: border-box; 
          }
          body {
            padding: 0;
            margin: 0 !important;
            }
        `}
      </style>
      <Navigation resourceNameList={['timesheet']} />

      <Box key="title" className="week-title-container" sx={getWeekTitleContainerStyle()}>
        <Typography variant="h5">
          {selectedWeekDateRange.from.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
          })}
          —
          {selectedWeekDateRange.to.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
          })}
        </Typography>
      </Box>

      <Grid className="main-content" container justifyContent="center" sx={getMainContentStyle()}>
        <Box
          key="dataWrapper"
          className="content-element"
          sx={{
            maxWidth: '45em',
            alignSelf: 'center',
            boxSizing: 'border-box',

            backgroundColor: 'transparent',
          }}
        >
          <Box key="data" className="work-blocks-wrapper" sx={getWorkBlocksWrapperStyle()}>
            {workData
              .filter((workDay: TimesheetDayRecord) =>
                selectedWeekDays.some((x: Temporal.PlainDate) => x.equals(workDay.date)),
              )
              .map((day: TimesheetDayRecord) => (
                <Box className="work-day" key={day.date.toString()} sx={getWorkDayStyle()}>
                  <Box className="work-day-header" sx={getWorkDayHeaderStyle()}>
                    <Typography className="work-day-date" variant="h6" sx={getWorkDayDateStyle()}>
                      <b>
                        {day.date.toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </b>
                    </Typography>
                    <Typography
                      className="work-day-hours"
                      variant="subtitle1"
                      sx={getWorkDayHoursStyle()}
                    >
                      <b>{workDataAggregator.getDayWorkHoursTotal(day.date)}h</b>
                    </Typography>
                  </Box>

                  <Box className="day-work-blocks">
                    {day.workBlocks.length > 0
                      ? day.workBlocks.map(workBlock => (
                          <WorkBlock {...workBlock} editMode={false} key={workBlock.workBlockId} />
                        ))
                      : ''}
                  </Box>
                </Box>
              ))}
          </Box>

          <Box key="weekTotal" className="week-total" sx={getWeekTotalStyle()}>
            <Typography
              className="text"
              variant="subtitle1"
              sx={{
                boxSizing: 'border-box',
                padding: '1em',
                textDecoration: 'underline',
                textUnderlineOffset: '0.4em',
              }}
            >
              Week Total: <b>{workDataAggregator.getWeekWorkHoursTotal()}h</b>
            </Typography>
          </Box>
        </Box>

        <Box
          key="sign"
          className="content-element"
          sx={{
            display: 'flex',
            width: '100%',

            padding: '1em 1.2em',
            backgroundColor: alpha(theme.palette.grey[300], 0.25),
            borderTop: '1px solid #bbb',

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box className="sign-box" sx={getSignBoxStyle()}>
            <Typography className="signed-statement" sx={getSignedStatementStyle()}>
              By signing this timesheet I,
              <br />
              <b>{username}</b>,<br />
              certify that above is an accurate reflection of all hours worked and not worked during
              the indicated time period.
            </Typography>

            <Box
              className="signature"
              component="form"
              sx={[
                getSignatureStyle(),
                {
                  justifyContent: {
                    xs: isSigned ? 'center' : 'flex-end',
                    sm: isSigned ? 'center' : 'flex-start',
                  },
                  padding: 0,
                },
              ]}
            >
              {!isSigned ? (
                <Button
                  className="sign-button"
                  variant="contained"
                  sx={getSignButtonStyle()}
                  onClick={() => handleReportSigning()}
                  startIcon={<EditIcon />}
                >
                  Sign
                </Button>
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Great Vibes, Brush Script MT, cursive',
                    fontSize: '2.5em',
                    fontStyle: 'italic',
                    borderBottom: '1px solid black',
                    padding: '0 0.5em',
                  }}
                >
                  {username}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>

      {isSigned && (
        <Box
          className="content-element downloads-box"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2em 1em',

            marginTop: {
              xs: '2em',
              sm: '1em',
            },

            marginBottom: '4em',

            border: '1px solid #dcdcdc',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '45em',

            backgroundColor: '#f6f6f8',
          }}
        >
          <Typography ref={downloadsBoxRef} sx={getDownloadsBoxStyle()}>
            Download:
            <Button
              variant="contained"
              sx={{
                margin: '0 0.5em',
              }}
              disabled={!reports.find(x => x.format === '.pdf')?.reportDocument}
            >
              <a
                href={reports.find(x => x.format === '.pdf')?.reportDocument?.blobUrl ?? ''}
                download={reports.find(x => x.format === '.pdf')?.reportDocument?.fileName ?? ''}
              >
                .pdf
              </a>
              {!reports.find(x => x.format === '.docx')?.reportDocument && (
                <CircularProgress
                  size={20}
                  thickness={6}
                  sx={{
                    alignContent: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-0.8em',
                  }}
                />
              )}
            </Button>
            <Button
              variant="contained"
              disabled={!reports.find(x => x.format === '.docx')?.reportDocument}
            >
              <a
                href={reports.find(x => x.format === '.docx')?.reportDocument?.blobUrl ?? ''}
                download={reports.find(x => x?.format === '.docx')?.reportDocument?.fileName ?? ''}
              >
                .docx
              </a>
              {!reports.find(x => x.format === '.docx')?.reportDocument && (
                <CircularProgress
                  id="circular-progress"
                  size={20}
                  thickness={6}
                  sx={getCircularProgressStyle()}
                />
              )}
            </Button>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReportPage;
