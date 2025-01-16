import { addWorkBlock, getWorkBlocks, deleteWorkBlock } from "../services/workBlockService.js";

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
    );

    res.status(201).json({ success: true, message: 'Work block added successfully' });
  }

  const deleteWorkBlockController = (req, res) => {
    try {
      const result = deleteWorkBlock(req.query.id);
      res.status(200).json("Work block deleted successfully");
    }
    catch (error) {
      throw new error(error);
    }
  }
}
