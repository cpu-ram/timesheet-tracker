import dbPool from '../../config/dbPool.js';

export async function addProjectRecord({
  id,
  type = null,
  address = null,
  name = null,
  supervisorId = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  defaultBreakStartTime = null,
  defaultBreakEndTime = null,
}
) {
  const query = `
    INSERT INTO projects(
    project_id, project_type, project_address, project_name, supervisor_id,
    default_work_start_time, default_work_end_time, 
    default_break_start_time, default_break_end_time
    )
    VALUES($1, $2, $3, $4, $5, 
    $6, $7, 
    $8, $9);
  `;
  const values = [id, type, address, name, supervisorId,
    defaultWorkStartTime, defaultWorkEndTime,
    defaultBreakStartTime, defaultBreakEndTime];
  try {
    const result = await dbPool.query(query, values);
    return true;
  } catch (error) {
    if (error.code === '23505') {
      const duplicateError = new Error(`Project record #${id} already exists`);
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw new Error("Unable to add project record: " + error.message);
  }
}