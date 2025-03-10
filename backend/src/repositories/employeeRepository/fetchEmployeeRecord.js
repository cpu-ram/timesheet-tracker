import dbPool from '../../config/dbPool.js';

export async function fetchEmployeeRecord(employeeId) {
  let query = `
    SELECT
      employee_id as id,
      employee_name as name,
      employee_nickname as nickname
    FROM
      employees
    WHERE
      employee_id =$1;
    `;
  let values = [employeeId];
  let result = undefined;
  try {
    result = await dbPool.query(query, values);
    if (result.rowCount === 0) return null;
    return result.rows[0];
  }
  catch (error) {
    throw new Error("Unable to fetch employee records");
  }
}