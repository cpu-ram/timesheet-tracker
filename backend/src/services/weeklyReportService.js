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
function formatWorkBlocksForDailyReport(jobBlockArray) {
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

  let workBlocks = jobBlockArray.map(
    function (jobBlock) {
      let result = {
        jobId: jobBlock.jobId,
        date: format(jobBlock.startTime, 'MM/dd EEE'),
        startTime: format(jobBlock.startTime, 'p'),
        endTime: format(jobBlock.endTime, 'p'),
        hours: calculateNumberOfHours(new Date(jobBlock.startTime), new Date(jobBlock.endTime)),
      }
      return result;
    }
  );
  let wrappedResult = { workBlocks: workBlocks };
  return wrappedResult;
}

export default function generateWeeklyReport(employeeId, payPeriodEndDate) {
  const [beginningOfFirstDay, endOfFinalDay] = getWeekBoundaries(payPeriodEndDate);
  const workBlocks = getWorkBlocks(employeeId, beginningOfFirstDay, endOfFinalDay);
  const formattedWorkBlocks = formatWorkBlocksForDailyReport(workBlocks);

  const uniqueFileName = `weekly-report-${employeeId}-${uuidv4()}.docx`;
  const singleFileName = 'weekly-report-single-item.docx';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const templatePath = path.resolve(__dirname, '../../assets/timesheet-template.docx');
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip);
  doc.setData(formattedWorkBlocks);

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
