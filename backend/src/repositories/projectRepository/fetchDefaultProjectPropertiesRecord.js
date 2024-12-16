import dbPool from '../../config/dbPool.js';

export const fetchDefaultProjectPropertiesRecord = async (jobId) => {
  const query = `
    SELECT 
    default_work_start_time, default_work_end_time, 
    default_break_start_time, default_break_end_time 
    FROM projects
    WHERE project_id=$1;
  `;
  const values = [jobId];
  let result = undefined;
  try {
    result = await dbPool.query(query, values);
  } catch (error) {
    throw new Error('Unable to fetch default jobsite properties');
  }
  if (result.rowCount === 0) return null;
  else return result.rows[0];
}
