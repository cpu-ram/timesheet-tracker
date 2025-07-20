import dbPool from '../../config/dbPool.js';

export async function fetchSignUpCompletionStatusRecord(employeeId: number) {
  let result = undefined;

  const query = `
    SELECT
      sign_up_complete
    FROM
      employees
    WHERE 
      id = $1`;
  const values = [employeeId];

  try {
    result = await dbPool.query(query, values);
    if (!result.rowCount) throw new Error('Bad database response');

    if (result.rowCount === 0) {
      throw new Error('No employee found with the given ID');
    }
    if (result.rowCount > 1) {
      throw new Error('Database inconsistency: multiple records found for a single employee');
    }
    return result.rows[0].sign_up_complete;
  }
  catch (error) {
    console.error(error);
  }

}
