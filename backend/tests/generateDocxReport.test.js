import generateWeeklyReport from '../src/services/weeklyReportService.js';
import dotenv from 'dotenv';

dotenv.config();

const date = new Date();
if (date.getDay() > 1) {
  date.setDate(date.getDate() - date.getDay() + 7);
}
else {
  date.setDate(date.getDate() - date.getDay());
}

const outputLocation = await generateWeeklyReport(10, date);
console.log(outputLocation);


