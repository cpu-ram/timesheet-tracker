import dbPool from '../../config/dbPool.js';

export async function updateProjectRecord({
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
}: {
  id: string;
  type?: string | null;
  address?: string | null;
  name?: string | null;
  supervisorId?: string | null;
  description?: string | null;

  defaultWorkStartTime?: string | null;
  defaultWorkEndTime?: string | null;
  defaultBreakStartTime?: string | null;
  defaultBreakEndTime?: string | null;
}) {
  const query = `
    UPDATE projects
    SET type = $2,
        address = $3,
        name = $4,
        supervisor_id = $5,
        description = $6,

        default_work_start_time = $7,
        default_work_end_time = $8,
        default_break_start_time = $9,
        default_break_end_time = $10
    WHERE id = $1
    RETURNING *;
  `;
  const values = [
    id, type, address, name, supervisorId, description,

    defaultWorkStartTime, defaultWorkEndTime,
    defaultBreakStartTime, defaultBreakEndTime
  ];

  try {
    const result = await dbPool.query(query, values);
    const row = result.rows[0];
    return {
      jobsiteId: row.id,
      type: row.type,
      jobsiteAddress: row.address,
      supervisorId: row.supervisor_id,
      jobsiteName: row.name,
      jobsiteDescription: row.description,

      defaultWorkStartTime: row.default_work_start_time,
      defaultWorkEndTime: row.default_work_end_time,
      defaultBreakStartTime: row.default_break_start_time,
      defaultBreakEndTime: row.default_break_end_time,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Unable to update project record: " + error.message);
    }
  }
}
