import dbPool from '../../config/dbPool.js';

export async function addEmployeeRecord(
  { employeeName, employeeNickname, email } = {
    employeeName: null,
    employeeNickname: null,
    email: null
  }
) {
  const query = `
    INSERT INTO employees(name, nickname, email, sign_up_complete)
    VALUES($1, $2, $3, $4)
    RETURNING id, name, nickname;
  `;
  const values = [employeeName, employeeNickname, email, false];
  try {
    const result = await dbPool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Unable to add employee");
  }
}