import dbPool from '../../config/dbPool.js';

export async function markSignupRecordComplete(employeeId) {
  let result = undefined;

  let query = `
    UPDATE employees
    SET sign_up_complete=true
    WHERE employee_id=$1
    `;
  let values = [employeeId];

  try {
    result = await dbPool.query(query, values);
    return true;
  }
  catch (error) {
    console.error(error);
    return false;
  }
}