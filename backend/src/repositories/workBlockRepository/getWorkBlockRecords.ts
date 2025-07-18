import dbPool from '../../config/dbPool.js';

export const getWorkBlockRecords = async (
  employeeId: number,
  reportedBy: number,
  startDate: Date,
  endDate: Date,
) => {
  let formattedStartDate = null;
  let formattedEndDate = null;
  try {
    formattedStartDate = startDate.toString();
    formattedEndDate = endDate.toString();
  }
  catch (error) {
    throw error;
  }

  const query = `
    SELECT 
    work_periods.work_period_id AS "workBlockId",
    coalesce(projects.project_id, work_periods.temp_project_id) AS "jobsiteId",
    work_periods.reported_by AS "reportedBy",
    work_periods.employee_id AS "employeeId",
    work_start AS "workBlockStart",
    work_end AS "workBlockEnd",
    break_start AS "breakStart",
    break_end AS "breakEnd",
    coalesce(projects.project_address, work_periods.temp_project_location) AS "jobsiteAddress",
    coalesce(projects.project_name, work_periods.temp_project_name) AS "jobsiteName",
    work_periods.supervisor_id AS "supervisorId",
    coalesce(employees.employee_name, work_periods.temp_supervisor_name) AS "supervisorName",
    work_periods.additional_notes AS "additionalNotes"
    FROM
      work_periods
    LEFT JOIN 
      projects
    ON
      work_periods.project_id=projects.project_id
    LEFT JOIN 
      employees on projects.supervisor_id=employees.employee_id
    WHERE 
      work_periods.employee_id = $1
    AND 
      work_periods.reported_by = $2
    AND 
      date >= $3
    AND 
      date <= $4
    ORDER BY 
      date, 
      work_start;
  `;
  const values = [employeeId, reportedBy, formattedStartDate, formattedEndDate];
  try {
    const result = await dbPool.query(query, values);
    if (result.rowCount === 0) return null;
    return result.rows;
  } catch (error) {
    throw new Error('Unable to fetch work block records');
  }
};
