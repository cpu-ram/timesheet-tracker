import { getEmployees } from '../services/employeeService.js';

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