import dotenv from 'dotenv';
import generateWeeklyReport from '../src/services/weeklyReportService.js';

dotenv.config();

const date = new Date();
if (date.getDay() > 1) {
  date.setDate(date.getDate() - date.getDay() + 7);
} else {
  date.setDate(date.getDate() - date.getDay());
}

const outputLocation = await generateWeeklyReport(10, date);
test('Report returns some output location', () => {
  expect(outputLocation).toBeTruthy();
});
console.log(outputLocation);
