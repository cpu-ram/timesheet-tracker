import { generateTimesheetReport } from "../services/timesheetReportService.js";
import { startOfDay } from "date-fns";
import { format } from "date-fns";

export const generateTimesheetReportHandler = async (req, res) => {
  let resultBuffer = undefined;
  try {
    let from = startOfDay(new Date(req.body.from));
    let to = startOfDay(new Date(req.body.to));
    resultBuffer = await generateTimesheetReport(
      req.body.employeeId, from, to, req.body.fullName
    );
    const fileName = `${req.body.fullName}_timesheet_${format(from, 'yyyy-mm-dd')}${format(to, 'yyyy-mm-dd')}`;
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.docx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    res.status(200).send(resultBuffer);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}