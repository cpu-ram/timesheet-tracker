import { addEmployeeRecord } from '../repositories/addEmployeeRecord.js';

export function addEmployee(
  employee_name = null,
  employee_nickname = null,
  title = null,
  email = null,
) {
  return addEmployeeRecord();
}
