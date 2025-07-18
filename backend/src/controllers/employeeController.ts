import { getEmployees, updateEmployeeName, markSignupComplete } from '../services/employeeService.js';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest.js';
import { Response } from 'express';

export const getEmployeesHandler = async (req: AuthenticatedRequest, res: Response) => {
  let result = undefined;
  try {
    result = await getEmployees();
    res.json(result);
  }
  catch (error: unknown) {
     if(error instanceof Error){
       res.status(500).json(error.message);
     }
  }
}

export const updateEmployeeNameHandler = async (req: AuthenticatedRequest, res: Response) => {
  const newName = req.body.name;
  if (newName == null || newName === undefined || newName.length === 0) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  if(!req.user) throw new Error('Authentification error');
  const result = await updateEmployeeName(req.user.id as number, newName);
  res.status(200).json(true);
  return;
}

export const completeSignupHandler = async (req: AuthenticatedRequest, res: Response) => {
  const newName = req.body.name;
  if (!newName) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  if(!req.user) throw new Error('Authentification error');
  try {
    if(!req.user.id) throw new Error('Internal authentication error');
	  
    const employeeNameUpdated = await updateEmployeeName(req.user.id as number, newName);
    const employeeCompletedSignup = await markSignupComplete(req.user.id);
    if (employeeNameUpdated && employeeCompletedSignup) {
      res.status(200).json(true);
      return;
    }
  }
  catch (error: unknown) {
    if(error instanceof Error){
      res.status(500).json(error.message);
      return;
    }
  }
}
