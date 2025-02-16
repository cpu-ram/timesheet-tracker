import { generateTimesheetReport } from "../services/timesheetReportService.js";
import { startOfDay } from "date-fns";
import { format } from "date-fns";
import { Temporal } from '@js-temporal/polyfill';

export const generateTimesheetReportHandler = async (req, res) => {
  let resultBuffer = undefined;
  try {
    let from = Temporal.PlainDate.from(req.body.from);
    let to = Temporal.PlainDate.from(req.body.to);
    resultBuffer = await generateTimesheetReport(
      req.body.employeeId, from, to, req.body.fullName
    );
    const fileName = `${req.body.fullName}_timesheet_${from.toString()}_${to.toString()}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.docx"`);
    res.setHeader('X-File-Name', `${fileName}.docx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    res.status(200).send(resultBuffer);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}