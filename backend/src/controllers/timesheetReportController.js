import { Temporal } from '@js-temporal/polyfill';

import { getEmployeeById } from '../services/employeeService.js';
import generateWeeklyReport from '../services/weeklyReport/weeklyReportService.js';

export const generateTimesheetReportHandler = async (req, res) => {
  let resultBuffer = undefined;

  const employeeId = req.user.id;
  const employee = await getEmployeeById(employeeId)
  const employeeName = req.user.name;
  let from = Temporal.PlainDate.from(req.body.from);
  let to = Temporal.PlainDate.from(req.body.to);
  const reportFileFormat = req.body.format;
  const contentType = (() => {
    switch (reportFileFormat) {
      case '.pdf':
        return 'application/pdf';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        throw new TypeError('Invalid report file format');
    }
  })();

  try {
    resultBuffer = await generateWeeklyReport(
      employeeId, from, to, employeeName, reportFileFormat
    );

    res.setHeader('Content-Type', contentType);

    const fileName = `${employeeName.replace(/ /g, '_')}_timesheet_${from.toString()}_${to.toString()}`;
    res.setHeader('Content-Disposition', `attachment; filename='${fileName}.${reportFileFormat}'`);
    res.setHeader('X-File-Name', `${fileName}${reportFileFormat}`);

    res.status(200).send(resultBuffer);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}