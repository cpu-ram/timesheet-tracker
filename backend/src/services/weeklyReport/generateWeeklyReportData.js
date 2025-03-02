import { Temporal } from '@js-temporal/polyfill';
import { getTimesheetData } from '../timesheetDataService';
import { formatWorkDataForDailyReport } from './formatWorkDataForDailyReport';

export async function generateWeeklyReportData(employeeId, from, to, fullName) {
  const reportData = {};
  const [firstDay, lastDay] = [from, to];

  const prelimTimesheetData = await getTimesheetData(
    employeeId, firstDay, lastDay
  );

  const workBlocks = prelimTimesheetData
    .map(
      (day) => day.workBlocks.map(
        (block) => ({ ...block, date: day.date })
      )).reduce(
        (acc, cur) => (acc.concat(cur)), []
      );

  if (workBlocks) {
    const reportReadyWorkBlocks = formatWorkDataForDailyReport(workBlocks);
    reportData['workBlocks'] = reportReadyWorkBlocks;
    const totalHours = reportData['workBlocks']
      .map(x => x.hours)
      .reduce((x, y) => x + y, 0);
    const regularHours = totalHours > 40 ? 40 : totalHours;

    reportData['totalHours'] = totalHours;
    reportData['regularHours'] = regularHours;
  } else {
    reportData['workBlocks'] = [];
    reportData['totalHours'] = 0;
    reportData['regularHours'] = 0;
  }
  reportData['weekStartDate'] = firstDay.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  reportData['weekEndDate'] = lastDay.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  reportData['currentDate'] = Temporal.Now.plainDateISO().toString();
  reportData['fullName'] = fullName;

  return reportData;
}
