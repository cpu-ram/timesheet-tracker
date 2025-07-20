import dbPool from '../../config/dbPool.js';

export async function findProjectRecords(queryString: string) {
  const query = `
    SELECT 
      UPPER(projects.id) as id, 
      projects.address, 
      projects.name, 
      employees.name as "supervisorName", 
      employees.nickname as "supervisorNickname" 
    FROM
      projects 
    LEFT OUTER JOIN 
      employees 
    ON 
      projects.supervisor_id=employees.id 
    WHERE 
      projects.id ILIKE '%' || UPPER($1) || '%' OR
      projects.address ILIKE '%' || UPPER($1) || '%' OR
      projects.name ILIKE '%' || UPPER($1) || '%' OR
      employees.nickname ILIKE '%' || UPPER($1) || '%'
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
