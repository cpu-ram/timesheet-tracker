import dbPool from '../../config/dbPool.js';

export const fetchProjectRecord = async (jobsiteId: string) => {
  const query = `
    SELECT 

      projects.id AS "jobsiteId",
      type AS "jobType",
      address AS "jobsiteAddress",
      projects.name AS "jobsiteName",
      supervisor_id AS "supervisorId",
      description AS "jobsiteDescription",
      coalesce(employees.nickname, employees.name) AS "supervisorName",

      default_work_start_time AS "defaultWorkStartTime",
      default_work_end_time AS "defaultWorkEndTime",
      default_break_start_time AS "defaultBreakStartTime",
      default_break_end_time AS "defaultBreakEndTime"
    FROM 
      projects
    LEFT OUTER JOIN 
      employees 
    ON 
      projects.supervisor_id=employees.id
    WHERE 
      projects.id=$1;
  `;
  const values = [jobsiteId];
  try {
    const result = await dbPool.query(query, values);
    if (result.rowCount == null) throw new Error('Postgres query error');
    if (result.rowCount === 0) return null;
    if (result.rowCount > 1) throw new Error();
    return result.rows[0];
  } catch (error) {
    throw new Error('Unable to fetch jobsite');
  }
}
