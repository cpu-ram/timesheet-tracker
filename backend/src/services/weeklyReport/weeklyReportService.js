import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateWeeklyReportData } from './generateWeeklyReportData.js';
import generateHtmlTemplate from './generateHtmlTemplate.js';
import convertHtmlToPdf from './convertHtmlToPdf.js';

export default async function generateWeeklyReport(employeeId, from, to, signedName = 'John Doe') {

  const reportData = await generateWeeklyReportData(employeeId, from, to, signedName);

  const htmlTemplate = generateHtmlTemplate(reportData);
  const pdfBuffer = await convertHtmlToPdf(htmlTemplate);

  return pdfBuffer;
}
