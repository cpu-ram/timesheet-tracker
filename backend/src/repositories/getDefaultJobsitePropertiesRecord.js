import dbPool from '../config/dbPool.js';

const getDefaultJobsitePropertiesRecord = async (jobId) => {
  const query = `
    SELECT 
    default_work_start_time, default_work_end_time, 
    default_break_start_time, default_break_end_time 
    FROM projects
    WHERE project_id=$1;
  `;
  const values = [jobId];
  try {
    const result = await dbPool.query(query, values);
    return result.rows[0] ?? null;
  } catch (error) {
    throw new Error('Unable to fetch default jobsite properties');
  }
};
export default getDefaultJobsitePropertiesRecord;
