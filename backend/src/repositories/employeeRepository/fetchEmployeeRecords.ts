import dbPool from '../../config/dbPool.js';

export async function fetchEmployeeRecords() {
  let query = `
    SELECT
      id,
      name,
      nickname
    FROM
      employees;
    `;
  let result = undefined;
  try {
    result = await dbPool.query(query);
    if (result.rowCount === 0) return null;
    return result.rows;
  }
  catch (error) {
    throw new Error("Unable to fetch employee records");
  }
}