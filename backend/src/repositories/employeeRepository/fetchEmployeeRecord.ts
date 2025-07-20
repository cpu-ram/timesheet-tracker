import dbPool from '../../config/dbPool.js';

export async function fetchEmployeeRecordById(employeeId: number) {
  let query = `
    SELECT
      id,
      name,
      nickname
    FROM
      employees
    WHERE
      id =$1;
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
export async function fetchEmployeeRecordByEmail(email: string) {
  let query = `
    SELECT
      id,
      name,
      nickname
    FROM
      employees
    WHERE
      email =$1;
    `;
  let values = [email];

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
