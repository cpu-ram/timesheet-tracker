import dbPool from '../../config/dbPool.js';

export async function fetchJobsitePreviewRecords(queryString) {
  const query = `
    SELECT 
      UPPER(project_id) as id, 
      project_address as address, 
      project_name as name
    FROM
      projects 
  `;
  try {
    const result = await dbPool.query(query, []);
    if (result.rowCount === 0) return null;
    return result.rows;
  }
  catch (err) {
    throw err;
  }
}