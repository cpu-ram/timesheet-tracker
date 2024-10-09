import pool from '../config/db.js';

export async function deleteWorkBlockRecord(workBlockRecordId) {
  const query = `
    DELETE FROM WORK_INTERVALS 
    WHERE work_period_id=$1;
  `;
  const values = [workBlockRecordId];
  try {
    const result = await pool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to remove the record.');
  }
}