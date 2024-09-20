import { getWorkBlocks } from 'workBlockService.js';
import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

const function getWeekBoundaries(payPeriodEndDate) {
  if (payPeriodEndDate.getDay() !== 0) throw new Error('payPeriodEndDate must be a Sunday');

  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const beginningOfFinalDay = new Date(payPeriodEndDate.setHours(0, 0, 0, 0));
  const endOfFinalDay = new Date(
    beginningOfFinalDay.getTime() + millisecondsInDay - 1000,
  );
  const beginningOfFirstDay = new Date(beginningOfFinalDay.getTime() - 6 * millisecondsInDay);

  return [beginningOfFirstDay, endOfFinalDay];
}
const formatWorkBlocksForDailyReport =
  (jobBlockArray) => jobBlockArray.map(jobBlock => ({
    jobNumber: jobBlock.jobId,
    date: jobBlock.startTime,
    startTime: jobBlock.startTime,
    endTime: jobBlock.endTime,
  }));

export default generateWeeklyReport = (
  (employeeId, payPeriodEndDate) => {
    const [beginningOfFirstDay, endOfFinalDay] = getWeekBoundaries(payPeriodEndDate);
    const workBlocks = getWorkBlocks(employeeId, beginningOfFirstDay, endOfFinalDay);
    const formattedWorkBlocks = formatWorkBlocksForDailyReport(workBlocks);

    const uniqueFileName = `weekly-report-${employeeId}-${uuidv4()}.docx`;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const templatePath = path.resolve(__dirname, '../../../assets/timesheet-template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip);
    doc.setData(formattedWorkBlocks);

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    const outputPath = path.resolve(__dirname, '../../temp/', uniqueFileName);
    fs.writeFileSync(outputPath, buf);

    return outputPath;

    doc.render();
  }
);
