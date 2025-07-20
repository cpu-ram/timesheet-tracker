import dbPool from '../../config/dbPool.js';

export async function updateEmployeeNameRecord(employeeId: number, newName: string) {
  let result = undefined;

  let query = `
    UPDATE employees
    SET name = $1
    WHERE id = $2
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
