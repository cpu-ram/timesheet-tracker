import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateWeeklyReportData } from './generateWeeklyReportData.js';
import generateHtmlTemplate from './generateHtmlTemplate.js';

export default async function generateWeeklyReport(employeeId, from, to, signedName = 'John Doe') {

  const reportData = await generateWeeklyReportData(employeeId, from, to, signedName);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const templatePath = path.resolve(__dirname, '../../assets/timesheet-template.docx');
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip);
  doc.setData(reportData);

  const htmlTemplate = generateHtmlTemplate(reportData).trim('\"').replace(/\n/g, '');

  doc.render();

  const buf = doc.getZip().generate({ type: 'nodebuffer' });

  return buf;
}
