import { Temporal } from '@js-temporal/polyfill';
import { getTimesheetData } from '../timesheetDataService.js';
import { formatWorkDataForDailyReport } from './formatWorkDataForDailyReport.js';
import { ReportData } from '../../types/ReportData.js';
import { FormattedWorkBlock } from '../../types/FormattedWorkBlock.js';

interface WorkBlockWithHours {hours: number}

export async function generateWeeklyReportData(employeeId: number, from: Temporal.PlainDate, to: Temporal.PlainDate, fullName: string) : Promise<ReportData> {
  const reportData : ReportData= {
    workBlocks: new Array<FormattedWorkBlock>(),
    totalHours: 0,
    regularHours: 0,
    overTimeHours: 0,
    weekStartDate: '',
    weekEndDate: '',
    currentDate:  Temporal.Now.plainDateISO().toString(),
    fullName: '',
  };
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

  if (workBlocks.length > 0) {
    const reportReadyWorkBlocks: FormattedWorkBlock[] = formatWorkDataForDailyReport(workBlocks);

    const totalHours = reportReadyWorkBlocks
      .map(x => x.hours)
      .reduce((x, y) => x + y, 0);


    reportData['workBlocks'] = reportReadyWorkBlocks;

    
    const regularHours = totalHours > 40 ? 40 : totalHours;
    const overTimeHours = totalHours > 40 ? totalHours - 40 : 0;

    reportData['totalHours'] = totalHours;
    reportData['regularHours'] = regularHours;
    reportData['overTimeHours'] = overTimeHours;
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
