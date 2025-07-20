import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateWeeklyReportData } from './generateWeeklyReportData.js';
import generateHtmlTemplate from './pdf/generateHtmlTemplate.js';
import convertHtmlToPdf from './pdf/convertHtmlToPdf.js';
import { getEmployeeById } from '../employeeService.js';
import { Temporal } from '@js-temporal/polyfill';
import { ReportData } from '../../types/ReportData.js';


export default async function generateWeeklyReport(employeeId: number, from: Temporal.PlainDate, to: Temporal.PlainDate, employeeName: string = 'John Doe', reportFileFormat: string) {

  let reportData: ReportData = await generateWeeklyReportData(employeeId, from, to, employeeName);
  let resultBuffer = undefined;
  try {
    switch (reportFileFormat.toLowerCase()) {
      case '.pdf':
        const htmlTemplate = generateHtmlTemplate(reportData);
        resultBuffer = Buffer.from(await convertHtmlToPdf(htmlTemplate));
        break;
      case '.docx':
        const filename = fileURLToPath(import.meta.url);
        const directory = dirname(filename);
        const templatePath = path.resolve(directory, '../../assets/timesheet-template.docx');

        if (!fs.existsSync(templatePath)) {
          throw new Error(`Template file not found at path: ${templatePath}`);
        }
        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip);
        doc.render(reportData);

        resultBuffer = doc.getZip().generate({ type: 'nodebuffer' });
        break;
      default:
        throw new TypeError('Invalid report file format');
    }
  }
  catch (error) {
    console.error(`Report generation error: ${error}`);
  }

  return resultBuffer;
}
