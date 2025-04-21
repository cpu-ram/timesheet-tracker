import { add } from "date-fns";
import { addWorkBlock, getWorkBlocks, deleteWorkBlock, updateWorkBlock } from "../services/workBlockService/workBlockService.js";

export const getWorkBlocksController = (req, res) => {
  try {
    const workBlocks = getWorkBlocks(req.query.employeeId, req.query.reportedById, new Date(req.query.from), new Date(req.query.to));
    res.status(200).json({ success: true, workBlocks });
  }
  catch (error) {
    throw error;
  }
};

export const addWorkBlockController = async (req, res) => {
  try {
    const {
      jobsiteId,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      dates,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    } = req.body;
    if (!Array.isArray(dates) || dates.length === 0) {
      throw new Error('No dates provided');
    }

    const employeeId = req.user.id;
    const reportedById = req.user.id;

    let result = {};

    result = await addWorkBlock(
      employeeId,
      reportedById,
      jobsiteId,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      dates,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    );

    const successMessage = result.workBlockIds.length > 1 ?
      'Work blocks added successfully' :
      'Work block added successfully';

    res.status(201).json({
      success: result.success,
      workBlockIds: result.workBlockIds,
      message: successMessage,
      newJobsiteCreated: result.newJobsiteCreated,
      jobsiteId: result.jobsiteId || null,
    });
  }
  catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export const deleteWorkBlockController = (req, res) => {
  try {
    const result = deleteWorkBlock(Number(req.params.workBlockId));
    res.status(200).json("Work block deleted successfully");
  }
  catch (error) {
    throw new error(error);
  }
}

export const updateWorkBlockController = async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      jobsiteId,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    } = req.body;
    const workBlockId = req.params.workBlockId;

    const result: {
      success: boolean;
      newJobsiteCreated: boolean;
      jobsiteId?: string | null;
    } = await updateWorkBlock(
      workBlockId, startTime, endTime,
      jobsiteId, tempJobsiteName,
      tempJobsiteAddress, tempSupervisorName,
      additionalNotes
    );

    res.status(201).json({
      ...result,
      message: result.success ? 'Work block updated successfully' : 'Failed to update work block',
    });
  }
  catch (error) {
    throw new Error(error);
  }
}

