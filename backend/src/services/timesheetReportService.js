import generateWeeklyReport from './weeklyReportService.js';

export const generateTimesheetReport = async (employeeId, from, to, fullName) => {
  const result = await generateWeeklyReport(employeeId, from, to, fullName);
  return result;
}


