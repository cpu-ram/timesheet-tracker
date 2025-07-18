import { add } from "date-fns";
import { addWorkBlock, getWorkBlocks, deleteWorkBlock, updateWorkBlock } from "../services/workBlockService/workBlockService.js";
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';

export const getWorkBlocksController = (req: AuthenticatedRequest, res: Response) => {
  try {
    const workBlocks = getWorkBlocks(Number(req.query.employeeId), Number(req.query.reportedById), new Date(req.query.from as string), new Date(req.query.to as string));
    res.status(200).json({ success: true, workBlocks });
  }
  catch (error) {
    throw error;
  }
};

export const addWorkBlockController = async (req: AuthenticatedRequest, res: Response) => {
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const employeeId = req.user.id;
    const reportedById = req.user.id;


    let result: {
      success: boolean;
      workBlockIds: number[];
      newJobsiteCreated: boolean;
      jobsiteId?: string | null;
    } = await addWorkBlock(
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
  catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
    else {
      throw error;
    }
  }
}

export const deleteWorkBlockController = (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = deleteWorkBlock(Number(req.params.workBlockId));
    res.status(200).json("Work block deleted successfully");
  }
  catch (error) {
    throw error;
  }
}

export const updateWorkBlockController = async (req: AuthenticatedRequest, res: Response) => {
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
    const workBlockId = Number(req.params.workBlockId);

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
    throw error;
  }
}

