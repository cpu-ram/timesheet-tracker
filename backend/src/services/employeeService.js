import { addEmployeeRecord, fetchEmployeeRecords, fetchEmployeeRecordById, fetchEmployeeRecordByEmail, updateEmployeeNameRecord, markSignupRecordComplete } from '../repositories/employeeRepository.js';

export async function addEmployee(
  { employeeName, employeeNickname, email } = {
    employeeName: null,
    employeeNickname: null,
    email: null
  }
) {
  const result = undefined;
  try {
    result = await addEmployeeRecord({ employeeName, employeeNickname, email });
  }
  catch (error) {
    console.error(error);
  }
  return result;
}

export async function getEmployeeByEmail(email) {
  let result = undefined;
  try {
    result = await fetchEmployeeRecordByEmail(email);
    return result;
  }
  catch (error) {
    console.error(error);
  }
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

export async function getEmployeeById(employeeId) {
  let result = undefined;
  try {
    result = await fetchEmployeeRecordById(employeeId);
    return result;
  }
  catch (error) {
    console.error(error);
  }
}

export async function updateEmployeeName(employeeId, newName) {
  let result = undefined;
  try {
    result = await updateEmployeeNameRecord(employeeId, newName);
    return result;
  }
  catch (error) {
    console.error(error);
  }
}

export async function markSignupComplete(employeeId) {
  let result = undefined;
  try {
    result = await markSignupRecordComplete(employeeId);
    return result;
  }
  catch (error) {
    console.error(error);
  }
}