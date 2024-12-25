import dbPool from '../../config/dbPool.js';

export async function fetchEmployeeRecords() {
  let query = `
    SELECT
      employee_id as id,
      employee_name as name,
      employee_nickname as nickname
    FROM
      employees;
    `;
  let result = undefined;
  try {
    result = await dbPool.query(query);
    return result.rows;
  }
  catch (error) {
    throw new Error("Unable to fetch employee records");
  }
}