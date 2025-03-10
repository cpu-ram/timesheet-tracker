import { add } from "date-fns";
import { addWorkBlock, getWorkBlocks, deleteWorkBlock, updateWorkBlock } from "../services/workBlockService.js";
import exp from "constants";

export const getWorkBlocksController = (req, res) => {
  try {
    const workBlocks = getWorkBlocks(req.query.employeeId, req.query.reportedById, new Date(req.query.from), new Date(req.query.to));
    res.status(200).json({ success: true, workBlocks });
  }
  catch (error) {
    throw error;
  }
};

export const addWorkBlockController = (req, res) => {
  try {
    const {
      employeeId,
      reportedById,
      jobsiteId,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      date,
      tempJobsiteId,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    } = req.body;

    const result = addWorkBlock(
      employeeId,
      reportedById,
      jobsiteId,
      startTime,
      endTime,
      breakStartTime,
      breakEndTime,
      date,
      tempJobsiteId,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    );

    res.status(201).json({ success: true, message: 'Work block added successfully' });
  }

  catch (error) {
    throw new Error(error);
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

export const updateWorkBlockController = (req, res) => {
  try {
    const {
      startTime,
      endTime,
      tempJobsiteId,
      tempJobsiteName,
      tempJobsiteAddress,
      tempSupervisorName,
      additionalNotes
    } = req.body;
    const workBlockId = req.params.workBlockId;

    const result = updateWorkBlock(
      workBlockId, startTime, endTime,
      tempJobsiteId, tempJobsiteName,
      tempJobsiteAddress, tempSupervisorName,
      additionalNotes
    );

    res.status(201).json({ success: true, message: 'Work block updated successfully' });
  }
  catch (error) {
    throw new Error(error);
  }
}

