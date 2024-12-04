import dbPool from '../../config/dbPool.js';

export async function findProjectRecords(queryString) {
  const query = `
    SELECT project_id, project_address, project_name, employee_name as supervisor_name, employee_nickname as supervisor_nickname from
    projects full outer join employees on projects.supervisor_id=employees.employee_id 
    where project_id LIKE '%' || $1 || '%' OR project_address LIKE '%' || $1 || '%' OR project_name LIKE '%' || $1 || '%' OR employee_nickname LIKE '%' || $1 || '%'
  `;
  const values = [queryString];
  try {
    const result = await dbPool.query(query, values);
    return result.rows;
  }
  catch (err) {
    throw err;
  }
}