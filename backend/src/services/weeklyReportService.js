import { getWorkBlocks } from './workBlockService.js';
import { getJobsite } from './jobsiteService.js';
import { getTimesheetData } from './timesheetDataService.js';
import { startOfDay } from 'date-fns';
import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';

function formatWorkBlocksForDailyReport(workBlockArray, betterWorkBlockArray) {
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

export default async function generateWeeklyReport(employeeId, from, to, fullName = 'John Doe') {
  const reportData = {};
  const [firstDay, lastDay] = [from, to];
  const workBlocks = await getWorkBlocks(employeeId, employeeId, firstDay, lastDay);

  /*  const prelimTimesheetData = await getTimesheetData(
      employeeId, firstDay, lastDay);
  
    const betterWorkBlocks = prelimTimesheetData
      .map(
        (day) =>
          day.workBlocks.map(
            (block) => ({ ...block, date: day.date })
          )).reduce(
            (acc, cur) => (acc.concat(cur)), []
          );
  */

  for (const workBlock of workBlocks) { // enriching workBlocks with jobsiteAddress
    const jobsite = await getJobsite(workBlock.jobsiteId);

    workBlock.jobsiteAddress = jobsite ? jobsite.jobsiteAddress : (workBlock.tempLocation ?? '');
    workBlock.jobsiteName = jobsite ? jobsite.jobsiteName : (workBlock.tempJobsiteName ?? '');
    workBlock.workStartTime = workBlock.workStartTime ? new Date(workBlock.workStartTime) : null;
    workBlock.workEndTime = workBlock.workEndTime ? new Date(workBlock.workEndTime) : null;
  };

  const reportReadyWorkBlocks = formatWorkBlocksForDailyReport(workBlocks);
  reportData['workBlocks'] = reportReadyWorkBlocks;
  const totalHours = reportData['workBlocks']
    .map(x => x.hours)
    .reduce((x, y) => x + y, 0);
  const regularHours = totalHours > 40 ? 40 : totalHours;

  reportData['totalHours'] = totalHours;
  reportData['regularHours'] = regularHours;
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
