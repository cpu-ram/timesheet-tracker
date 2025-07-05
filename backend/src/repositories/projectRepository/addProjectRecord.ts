import dbPool from '../../config/dbPool.js';
import { DatabaseError } from 'pg';
import { JobsiteConstraintError } from '../../errors/errors.ts';

export async function addProjectRecord({
  id,
  type = null,
  address = null,
  name = null,
  supervisorId = null,
  description = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  defaultBreakStartTime = null,
  defaultBreakEndTime = null,
}
) {
  const query = `
    INSERT INTO projects(
    project_id, project_type, project_address, project_name, 
    supervisor_id, project_description,

    default_work_start_time, default_work_end_time, 
    default_break_start_time, default_break_end_time
    )
    VALUES(
    $1, $2, $3, $4, 
    $5, $6,

    $7, $8, 
    $9, $10
    )
    RETURNING project_id
    ;
  `;
  const values = [
    id, type, address, name,
    supervisorId, description,
    defaultWorkStartTime, defaultWorkEndTime,
    defaultBreakStartTime, defaultBreakEndTime];
  try {
    const result = await dbPool.query(query, values);
    return result.rows[0].project_id;
  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.code === '23505') {
        const duplicateError = new Error(`Project record #${id} already exists`);
        duplicateError.status = 409;
        throw duplicateError;
      }
      if (error.code === '22001') {
        const lengthError = new JobsiteConstraintError(`One or more jobsite record fields exceed the maximum length`);
        lengthError.status = 400;
        throw lengthError;
      }
    }
    throw new Error("Unable to add project record: " + error.message);
  }
}
