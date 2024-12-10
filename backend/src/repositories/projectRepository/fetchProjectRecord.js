import dbPool from '../../config/dbPool.js';

export const fetchProjectRecord = async (projectId) => {
  const query = `
    SELECT 
    project_id, project_type, project_address, project_name, 
    supervisor_id,
    default_work_start_time, default_work_end_time, 
    default_break_start_time, default_break_end_time 
    FROM projects
    WHERE project_id=$1;
  `;
  const values = [projectId];
  try {
    const result = await dbPool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Unable to fetch jobsite');
  }
}
