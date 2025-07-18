import { addJobsite, findJobsites, getJobsite, deleteJobsite, updateJobsite, getJobsitePreviews } from '../services/jobsiteService.js'
import { BackendError } from '../errors/errors.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { Response } from 'express';

export const findJobsitesHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  try {
    result = await findJobsites(req.query.query as string);
    res.json(result);
  }
  catch (error) {
    if (error instanceof Error){
      res.status(500).json(error.message);
    }
  }
}

export const getJobsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  if (!req.params.id) {
    res.status(400).json({ message: 'Jobsite ID is required' });
    return;
  }
  try {
    result = await getJobsite(req.params.id);
    res.json(result);
  }
  catch (error) {
    res.status(500).json(error);
  }
}

export const addJobsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  try {
    result = await addJobsite({
      id: req.body.id,
      type: req.body.type,
      address: req.body.address,
      description: req.body.description,
      name: req.body.name,
      supervisorId: req.body.supervisorId,
      defaultWorkStartTime: req.body.defaultWorkStartTime,
      defaultWorkEndTime: req.body.defaultWorkEndTime,
      defaultBreakStartTime: req.body.defaultBreakStartTime,
      defaultBreakEndTime: req.body.defaultBreakEndTime,
    }
    );
    res.json(result);
  }
  catch (error) {
    if (error instanceof BackendError){
      const statusCode = error.status || 500;
      res.status(statusCode).json({ message: error.message });
      return;
    }
  }
}

export const updateJobsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.body.id) {
    res.status(400).json({ message: 'Jobsite ID is required' });
    return;
  }

  let result = undefined;
  try {
    result = await updateJobsite({
      id: req.body.id,
      type: req.body.type,
      address: req.body.address,
      name: req.body.name,
      supervisorId: req.body.supervisorId,
      description: req.body.description,

      defaultWorkStartTime: req.body.defaultWorkStartTime,
      defaultWorkEndTime: req.body.defaultWorkEndTime,
      defaultBreakStartTime: req.body.defaultBreakStartTime,
      defaultBreakEndTime: req.body.defaultBreakEndTime,
    }
    );
    res.json(result);
  }
  catch (error) {
    if(error instanceof Error){
      const statusCode = (error instanceof BackendError) ? Number(error.status) : 500;
      res.status(statusCode).json({ message: error.message });
      return;
  }
  }
}

export const getJobsitePreviewsHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  try {
    result = await getJobsitePreviews();
    res.json(result);
  }
  catch (error) {
    if(error instanceof Error) res.status(500).json(error.message);
  }
}

export const deleteJobsiteHandler = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ message: 'Jobsite ID is required' });
    return;
  }

  let result = undefined;

  try {
    result = await deleteJobsite(req.params.id);
    res.json(result);
  }
  catch (error) {
    if(error instanceof Error){
      if(error instanceof BackendError){
	const statusCode = error.status || 500;
      	res.status(statusCode).json({ message: error.message });
      }
      return;
    }
  }
}
