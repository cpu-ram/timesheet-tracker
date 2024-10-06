import generateWeeklyReport from '../src/services/weeklyReportService.js';
import { generateDefaultWeeklyWorkRecords } from '../src/services/generateDefaultWeeklyWorkRecordsService.js';
import dotenv from 'dotenv';
dotenv.config();


process.env.NODE_ENV = 'test';
const date = new Date('2024-09-29T00:00:00');

// const date = new Date();
// date.setDate(date.getDate() - date.getDay() + 7);

generateDefaultWeeklyWorkRecords(process.env.JOB_ID, 10);
const outputLocation = generateWeeklyReport(10, date);

console.log(outputLocation);