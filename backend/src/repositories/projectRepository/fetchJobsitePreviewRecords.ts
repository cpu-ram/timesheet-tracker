import dbPool from '../../config/dbPool.js';

export async function fetchJobsitePreviewRecords() {
  const query = `
    SELECT 
      UPPER(id) as "jobsiteId", 
      address as "jobsiteAddress", 
      name as "jobsiteName"
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
