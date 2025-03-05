import path from 'path';
import * as fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateWeeklyReportData } from './generateWeeklyReportData.js';
import generateHtmlTemplate from './pdf/generateHtmlTemplate.js';
import convertHtmlToPdf from './pdf/convertHtmlToPdf.js';
import Docxtemplater from 'docxtemplater';
import PizzZip from 'pizzip';
import { getEmployee } from '../services/employeeService.js';


export default async function generateWeeklyReport(employeeId, from, to, signedName = 'John Doe', reportFileFormat, req, res) {

  const reportData = await generateWeeklyReportData(employeeId, from, to, signedName);
  const resultBuffer = undefined;

  switch (reportFileFormat) {
    case '.pdf':
      const htmlTemplate = await generateHtmlTemplate(reportData);
      resultBuffer = await Buffer.from(await convertHtmlToPdf(htmlTemplate));
      break;
    case '.docx':

      return null;
  }

  return resultBuffer;
}
