import dbPool from '../../config/dbPool.js';

export async function updateEmployeeNameRecord(employeeId, newName) {
  let result = undefined;

  let query = `
    UPDATE employees
    SET employee_name = $1
    WHERE employee_id = $2
    `;
  let values = [newName, employeeId];

  try {
    result = await dbPool.query(query, values);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}