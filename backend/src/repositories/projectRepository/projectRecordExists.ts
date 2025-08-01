import dbPool from '../../config/dbPool.js';

export const projectRecordExists = async (jobsiteId: string) => {
  const query = `
    SELECT 
      EXISTS (
        SELECT
          1
        FROM
          projects
        WHERE 
          id=$1
      );
  `;
  const values = [jobsiteId];
  try {
    const result = await dbPool.query(query, values);
    return result.rows[0].exists;
  } catch (error) {
    throw new Error('Unable to check for existence of a jobsite record');
  }
}
