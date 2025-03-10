import { addEmployeeRecord, fetchEmployeeRecords, fetchEmployeeRecord } from '../repositories/employeeRepository.js';

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
    return result;
  }
  catch (error) {
    console.error(error);
  }
}

export async function getEmployee(employeeId) {
  let result = undefined;
  try {
    result = await fetchEmployeeRecord(employeeId);
    return result;
  }
  catch (error) {
    console.error(error);
  }
}
