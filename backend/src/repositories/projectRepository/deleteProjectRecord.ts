import dbPool from '../../config/dbPool.js';

export const deleteProjectRecord = async (id: string) => {

  const client = await dbPool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE work_periods 
    SET project_id = null, temp_project_id = $1
    WHERE project_id = $1
    ;`, [id]);

    await client.query(
      `
      DELETE 
      FROM projects
      WHERE id = $1
      `, [id]);

    await client.query(
      `
      COMMIT`
    );

    return { success: true };
  }
  catch (error) {
    await client.query('ROLLBACK');
    if (error instanceof Error) {
      throw new Error("Unable to delete project record: " + error.message);
    }
  }
  finally {
    client.release();
  }
}
