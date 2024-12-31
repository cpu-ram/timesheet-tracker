import dbPool from '../../config/dbPool.js';

export const fetchProjectRecord = async (projectId) => {
  const query = `
    SELECT 
      default_work_start_time AS "workStartTime",
      default_work_end_time AS "workEndTime",
      default_break_start_time AS "breakStartTime",
      default_break_end_time AS "breakEndTime",

      project_id AS id,
      project_type AS type,
      project_address AS address,
      project_name AS name,
      supervisor_id AS "supervisorId"

    FROM 
      projects
    WHERE 
      project_id=$1;
  `;
  const values = [projectId];
  try {
    const result = await dbPool.query(query, values);
    if (result.rowCount === 0) return null;
    return result.rows[0];
  } catch (error) {
    throw new Error('Unable to fetch jobsite');
  }
}
