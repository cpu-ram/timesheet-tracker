import dbPool from '../../config/dbPool.js';

export const fetchProjectRecord = async (jobsiteId: string) => {
  const query = `
    SELECT 

      project_id AS "jobsiteId",
      project_type AS "jobType",
      project_address AS "jobsiteAddress",
      project_name AS "jobsiteName",
      supervisor_id AS "supervisorId",
      project_description AS "jobsiteDescription",
      coalesce(employees.employee_nickname, employees.employee_name) AS "supervisorName",

      default_work_start_time AS "defaultWorkStartTime",
      default_work_end_time AS "defaultWorkEndTime",
      default_break_start_time AS "defaultBreakStartTime",
      default_break_end_time AS "defaultBreakEndTime"
    FROM 
      projects
    LEFT OUTER JOIN 
      employees 
    ON 
      projects.supervisor_id=employees.employee_id
    WHERE 
      project_id=$1;
  `;
  const values = [jobsiteId];
  try {
    const result = await dbPool.query(query, values);
    if(!result.rowCount) throw new Error('Postgres query error');
    if (result.rowCount === 0) return null;
    if (result.rowCount > 1) throw new Error();
    return result.rows[0];
  } catch (error) {
    throw new Error('Unable to fetch jobsite');
  }
}
