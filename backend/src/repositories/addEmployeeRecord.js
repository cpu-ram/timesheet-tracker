import pool from '../config/db.js';

export async function addEmployee(
  employee_name = null,
  employee_nickname = null,
  title = null,
  email = null,
) {
  const query = `
    INSERT INTO employees(employee_name, employee_nickname, title_id, email)
    VALUES($1, $2, $3, $4);
  `;
  const values = [employee_name, employee_nickname, titles[title], email];
  try {
    const result = await pool.query(query, values);
    return true;
  } catch (error) {
    throw new Error("Unable to add employee");
  }
}