import { addEmployeeRecord, fetchEmployeeRecords } from '../repositories/employeeRepository.js';

export async function addEmployee(
  employee_name = null,
  employee_nickname = null,
  title = null,
  email = null,
) {
  return addEmployeeRecord();
}

export async function getEmployees() {
  let result = undefined;
  try {
    result = await fetchEmployeeRecords();
  }
  catch (error) {
    throw error;
  }
  if (result.rowCount === 0) {
    return null;
  }
  return result;
}
