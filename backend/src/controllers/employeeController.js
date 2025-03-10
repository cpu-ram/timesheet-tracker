import { getEmployees, updateEmployeeName, markSignupComplete } from '../services/employeeService.js';

export const getEmployeesHandler = async (req, res) => {
  let result = undefined;
  try {
    result = await getEmployees();
    res.json(result);
  }
  catch (error) {
    res.status(500).json(error.message);
  }
}

export const updateEmployeeNameHandler = async (req, res) => {
  const newName = req.body.name;
  if (newName == null || newName === undefined || newName.length === 0) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  const result = await updateEmployeeName(req.user.id, newName);
  res.status(200).json(true);
  return;
}

export const completeSignupHandler = async (req, res) => {
  const newName = req.body.name;
  if (!newName) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  try {
    const employeeNameUpdated = await updateEmployeeName(req.user.id, newName);
    const employeeCompletedSignup = await markSignupComplete(req.user.id);
    if (employeeNameUpdated && employeeCompletedSignup) {
      res.status(200).json(true);
      return;
    }
  }
  catch (error) {
    res.status(500).json(error.message);
    return;
  }
}