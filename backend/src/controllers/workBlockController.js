import { sampleWorkBlocks } from "../../tests/fixtures/workBlocks.js";
import { addWorkBlock, getWorkBlocks } from "../services/workBlockService.js";

export const getWorkBlocksController = (req, res) => {
  res.json(sampleWorkBlocks);
};

export const addWorkBlockController = (req, res) => {
  try {
    const {
      employeeId,
      reportedById,
      projectId,
      startDateTime,
      endDateTime,
      breakStartTime,
      breakEndTime,
      date,
    } = req.body;

    const result = addWorkBlock(
      employeeId,
      reportedById,
      projectId,
      startDateTime,
      endDateTime,
      breakStartTime,
      breakEndTime,
      date,
    );

    res.status(201).json({ success: true, message: 'Work block added successfully' });
  }
  catch (error) {
    throw error;
  }
}
