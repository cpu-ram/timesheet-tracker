import dbPool from '../../config/dbPool.js';

export async function findProjectRecords(queryString) {
  const query = `
    SELECT 
      UPPER(project_id) as id, 
      project_address as address, 
      project_name as name, 
      employees.employee_name as "supervisorName", 
      employees.employee_nickname as "supervisorNickname" 
    FROM
      projects 
    LEFT OUTER JOIN 
      employees 
    ON 
      projects.supervisor_id=employees.employee_id 
    WHERE 
      project_id ILIKE '%' || UPPER($1) || '%' OR
      project_address ILIKE '%' || UPPER($1) || '%' OR
      project_name ILIKE '%' || UPPER($1) || '%' OR
      employee_nickname ILIKE '%' || UPPER($1) || '%'
  `;
  const values = [queryString];
  try {
    const result = await dbPool.query(query, values);
    if (result.rowCount === 0) return null;
    return result.rows;
  }
  catch (err) {
    throw err;
  }
}