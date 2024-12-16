import dotenv from 'dotenv';
import generateWeeklyReport from '../src/services/weeklyReportService.js';

dotenv.config();

const finalDayOfWeek = new Date();
if (finalDayOfWeek.getDay() > 1) {
  finalDayOfWeek.setDate(finalDayOfWeek.getDate() - finalDayOfWeek.getDay() + 7);
} else {
  finalDayOfWeek.setDate(finalDayOfWeek.getDate() - finalDayOfWeek.getDay());
}
finalDayOfWeek.setHours(0, 0, 0, 0);

const outputLocation = await generateWeeklyReport(10, finalDayOfWeek);

console.log(outputLocation);
