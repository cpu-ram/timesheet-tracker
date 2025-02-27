import { getWorkBlocks } from './workBlockService.js';
import { getJobsite } from './jobsiteService.js';
import { getTimesheetData } from './timesheetDataService.js';
import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

function formatWorkBlocksForDailyReport(workBlockArray) {
  if (!workBlockArray || workBlockArray.length === 0) {
    throw new RangeError('No work blocks provided');
  }

  const calculateNumberOfHours = (startTime, endTime) => (
    Math.round(
      (
        endTime.getTime()
        - startTime.getTime()
      )
      / (1000 * 3600)
      * 10
    ) / 10
  );

  function formatToBasicTime(dateTime) {
    const entryDate = new Date(dateTime);
    const result = format(entryDate, 'p');
    return result;
  }

  let formattedWorkBlocks = workBlockArray.map(
    function (workBlock) {
      let result = {
        jobsiteId: workBlock.jobsiteId ? workBlock.jobsiteId.
          toUpperCase() : '—',
        date: workBlock.workBlockStart ? format(new Date(workBlock.workBlockStart), 'MM/dd EEE') : null,
        hours: workBlock.workBlockStart && workBlock.workBlockEnd ?
          calculateNumberOfHours(new Date(workBlock.workBlockStart), new Date(workBlock.workBlockEnd))
          :
          0,
        jobsiteDetails: workBlock.jobsiteName || workBlock.jobsiteAddress || '—',
      }

      const timePropertyNames = ['workBlockStart', 'workBlockEnd', 'breakStart', 'breakEnd'];
      timePropertyNames.forEach((propertyName) => {
        if (workBlock.hasOwnProperty(propertyName) && workBlock[propertyName] != null) {
          result[propertyName] = formatToBasicTime(workBlock[propertyName]);
        }
        else result[propertyName] = '—';
      });
      return result;
    }
  );

  return formattedWorkBlocks;
}

function formatBetterWorkBlocksForDailyReport(betterWorkBlockArray) {
  if (!betterWorkBlockArray || betterWorkBlockArray.length === 0) {
    throw new RangeError('No work blocks provided');
  }

  function calculateHours(startTime, endTime) {
    if (!startTime || !endTime) {
      throw new RangeError('Start time and end time are required');
    }
    if (Temporal.PlainTime.compare(startTime, endTime) > 0) {
      throw new RangeError('Start time must be before end time');
    }

    let interval = startTime.until(endTime, { largestUnit: 'hours', smallestUnit: 'minutes' });
    const totalMinutes = interval.hours * 60 + interval.minutes;
    return Math.round(totalMinutes / 60 * 10) / 10;
  }
  function formatTime(time) {
    if (!time) {
      return '-';
    }
    return time.toLocaleString('en-US', { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  function formatDate(date) {
    if (!date) {
      return '-';
    }

    let dateString = date.toLocaleString('en-US',
      {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }
    );

    let [weekday, monthDay] = dateString.split(', ');
    let result = `${monthDay} ${weekday}`;
    return result;
  }

  let formattedBetterWorkBlocks = betterWorkBlockArray.map(
    function (workBlock) {
      let result = {
        jobsiteId: workBlock.jobsiteId ? workBlock.jobsiteId.
          toUpperCase() : '—',
        date: formatDate(workBlock.date),
        hours: workBlock.workBlockStart && workBlock.workBlockEnd ?
          calculateHours(workBlock.workBlockStart, workBlock.workBlockEnd)
          :
          0,
        jobsiteDetails: workBlock.jobsiteName || workBlock.jobsiteAddress || '—',
        workBlockStart: workBlock.workBlockStart ? formatTime(workBlock.workBlockStart) : '-',
        workBlockEnd: workBlock.workBlockEnd ? formatTime(workBlock.workBlockEnd) : '-',
      }
      const timePropertyNames = ['workBlockStart', 'workBlockEnd', 'breakStart', 'breakEnd'];
      timePropertyNames.forEach((propertyName) => {
        if (workBlock.hasOwnProperty(propertyName) && workBlock[propertyName] != null) {
          result[propertyName] = formatTime(workBlock[propertyName]);
        }
        else result[propertyName] = '—';
      });
      return result;
    }

  );

  return formattedBetterWorkBlocks;
}

export default async function generateWeeklyReport(employeeId, from, to, fullName = 'John Doe') {
  const reportData = {};
  const [firstDay, lastDay] = [from, to];

  const prelimTimesheetData = await getTimesheetData(
    employeeId, firstDay, lastDay
  );

  const betterWorkBlocks = prelimTimesheetData
    .map(
      (day) =>
        day.workBlocks.map(
          (block) => ({ ...block, date: day.date })
        )).reduce(
          (acc, cur) => (acc.concat(cur)), []
        );

  if (betterWorkBlocks) {

    const reportReadyBetterWorkBlocks = formatBetterWorkBlocksForDailyReport(betterWorkBlocks);
    reportData['workBlocks'] = reportReadyBetterWorkBlocks;
    const totalHours = reportData['workBlocks']
      .map(x => x.hours)
      .reduce((x, y) => x + y, 0);
    const regularHours = totalHours > 40 ? 40 : totalHours;

    reportData['totalHours'] = totalHours;
    reportData['regularHours'] = regularHours;
  } else {
    reportData['workBlocks'] = [];
    reportData['totalHours'] = 0;
    reportData['regularHours'] = 0;
  }

  reportData['weekStartDate'] = firstDay.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  reportData['weekEndDate'] = lastDay.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  reportData['currentDate'] = Temporal.Now.plainDateISO().toString();
  reportData['fullName'] = fullName;

  const uniqueFileName = `weekly-report-${employeeId}-${uuidv4()}.docx`;
  const singleFileName = 'weekly-report-single-item.docx';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const templatePath = path.resolve(__dirname, '../../assets/timesheet-template.docx');
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip);
  doc.setData(reportData);

  doc.render();

  const buf = doc.getZip().generate({ type: 'nodebuffer' });
  let outputPath;
  if (process.env.NODE_ENV === 'test') {
    outputPath = path.resolve(__dirname, '../../temp/', singleFileName);
  } else {
    outputPath = path.resolve(__dirname, '../../temp/', uniqueFileName);
  }

  return buf;
}
