import generateWeeklyReport from '../services/weeklyReport/weeklyReportService.js';
import { Temporal } from '@js-temporal/polyfill';

export const generateTimesheetReportHandler = async (req, res) => {
  let resultBuffer = undefined;
  try {
    let from = Temporal.PlainDate.from(req.body.from);
    let to = Temporal.PlainDate.from(req.body.to);

    resultBuffer = await generateWeeklyReport(
      req.body.employeeId, from, to, req.body.fullName
    );

    const fileName = `${req.body.fullName.replace(/ /g, '_')}_timesheet_${from.toString()}_${to.toString()}`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename='${fileName}.pdf'`);
    res.setHeader('X-File-Name', `${fileName}.pdf`);

    res.status(200).send(Buffer.from(resultBuffer));
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}