import dbPool from '../../config/dbPool.js';

export async function deleteWorkBlockRecord(workBlockRecordId) {
  const query = `
    DELETE FROM WORK_PERIODS 
    WHERE work_period_id=$1;
  `;
  const values = [workBlockRecordId];
  try {
    const result = await dbPool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to remove the record.');
  }
}