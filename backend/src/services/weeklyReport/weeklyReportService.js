import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateWeeklyReportData } from './generateWeeklyReportData.js';
import generateHtmlTemplate from './pdf/generateHtmlTemplate.js';
import convertHtmlToPdf from './pdf/convertHtmlToPdf.js';
import { getEmployee } from '../employeeService.js';


export default async function generateWeeklyReport(employeeId, from, to, employeeName = 'John Doe', reportFileFormat) {

  let reportData = await generateWeeklyReportData(employeeId, from, to, employeeName);
  let resultBuffer = undefined;

  switch (reportFileFormat) {
    case '.pdf':
      const htmlTemplate = await generateHtmlTemplate(reportData);
      resultBuffer = await Buffer.from(await convertHtmlToPdf(htmlTemplate));
      break;
    case '.docx':
      const filename = fileURLToPath(import.meta.url);
      const directory = dirname(filename);
      const templatePath = path.resolve(directory, '../../assets/timesheet-template.docx');
      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);

      const doc = new Docxtemplater(zip);
      doc.setData(reportData);
      doc.render();

      resultBuffer = doc.getZip().generate({ type: 'nodebuffer' });
      break;
    default:
      throw new TypeError('Invalid report file format');
  }

  return resultBuffer;
}
