import generateWeeklyReport from '../src/services/weeklyReportService.js';

const date = new Date('2024-09-15T00:00:00');
const location = generateWeeklyReport(1, date);

console.log(location);