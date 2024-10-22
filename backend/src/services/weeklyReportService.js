import { getWorkBlocks } from './workBlockService.js';
import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

function getWeekBoundaries(payPeriodEndDate) {
  if (payPeriodEndDate.getDay() !== 0) throw new Error('payPeriodEndDate must be a Sunday');

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const beginningOfFinalDay = new Date(payPeriodEndDate.setHours(0, 0, 0, 0));
  const endOfFinalDay = new Date(
    beginningOfFinalDay.getTime() + millisecondsInDay - 1000,
  );
  const beginningOfFirstDay = new Date(beginningOfFinalDay.getTime() - 6 * millisecondsInDay);

  return [beginningOfFirstDay, endOfFinalDay];
}

function formatWorkBlocksForDailyReport(workBlockArray) {
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

  const formatToBasicTime = (dateTime) => format(dateTime, 'p');

  let workBlocks = workBlockArray.map(
    function (workBlock) {
      let result = {
        jobId: workBlock.project_id.toUpperCase(),
        date: format(workBlock.work_start, 'MM/dd EEE'),
        hours: calculateNumberOfHours(new Date(workBlock.work_start), new Date(workBlock.work_end)),
      }

      const timePropertyNames = ['work_start', 'work_end', 'break_start', 'break_end'];
      timePropertyNames.forEach((propertyName) => {
        if (workBlock.hasOwnProperty(propertyName) && workBlock[propertyName] != null) {
          result[propertyName] = formatToBasicTime(workBlock[propertyName]);
        }
        else result[propertyName] = '—';
      });

      return result;
    }
  );
  return workBlocks;
}

export default async function generateWeeklyReport(employeeId, payPeriodEndDate) {
  const reportData = {};
  const [beginningOfFirstDay, endOfFinalDay] = getWeekBoundaries(payPeriodEndDate);
  const workBlocks = await getWorkBlocks(employeeId, employeeId, beginningOfFirstDay, endOfFinalDay);
  reportData['workBlocks'] = formatWorkBlocksForDailyReport(workBlocks);
  const totalHours = reportData['workBlocks']
    .map(x => x.hours)
    .reduce((x, y) => x + y, 0);
  const regularHours = totalHours > 40 ? 40 : totalHours;

  reportData['totalHours'] = totalHours;
  reportData['regularHours'] = regularHours;
  reportData['weekStartDate'] = format(beginningOfFirstDay, 'MMM d, yyyy');
  reportData['weekEndDate'] = format(endOfFinalDay, 'MMM d, yyyy');
  reportData['currentDate'] = format(new Date(), 'MMM d, yyyy');

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

  fs.writeFileSync(outputPath, buf);

  return outputPath;
}
