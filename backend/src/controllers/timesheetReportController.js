import { Temporal } from '@js-temporal/polyfill';

import { getEmployee } from '../services/employeeService.js';
import generateWeeklyReport from '../services/weeklyReport/weeklyReportService.js';

function generateReportDocument(reportData) {

}

export const generateTimesheetReportHandler = async (req, res) => {
  let resultBuffer = undefined;

  const employeeId = req.body.employeeId;
  const employeeName = await getEmployee(employeeId).name;
  let from = Temporal.PlainDate.from(req.body.from);
  let to = Temporal.PlainDate.from(req.body.to);
  const reportFileFormat = req.body.reportFileFormat;
  const contentType = switch (reportFileFormat) {
    case '.pdf':
      return 'application/pdf';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  };

  try {
    resultBuffer = await generateWeeklyReport(
      employeeId, from, to, reportFileFormat, res
    );

    res.setHeader('Content-Type', contentType);

    const fileName = `${employeeName.replace(/ /g, '_')}_timesheet_${from.toString()}_${to.toString()}`;
    res.setHeader('Content-Disposition', `attachment; filename='${fileName}.pdf'`);
    res.setHeader('X-File-Name', `${fileName}${reportFileFormat}`);

    res.status(200).send(resultBuffer);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}