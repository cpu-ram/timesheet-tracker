import dbPool from '../../config/dbPool.js';

export async function fetchJobsitePreviewRecords() {
  const query = `
    SELECT 
      UPPER(project_id) as "jobsiteId", 
      project_address as "jobsiteAddress", 
      project_name as "jobsiteName"
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
