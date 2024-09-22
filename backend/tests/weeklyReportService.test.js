import generateWeeklyReport from '../src/services/weeklyReportService.js';
process.env.NODE_ENV = 'test';
const date = new Date('2024-09-22T00:00:00');
const location = generateWeeklyReport(1, date);

console.log(location);