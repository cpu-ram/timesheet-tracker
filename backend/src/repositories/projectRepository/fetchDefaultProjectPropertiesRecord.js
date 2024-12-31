import dbPool from '../../config/dbPool.js';

export const fetchDefaultProjectPropertiesRecord = async (jobId) => {
  const query = `
    SELECT 
    default_work_start_time as workStartTime, 
    default_work_end_time as workEndTime, 
    default_break_start_time as breakStartTime, 
    default_break_end_time as breakEndTime 
    FROM 
      projects
    WHERE 
      project_id=$1;
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
