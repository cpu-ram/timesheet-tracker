import dbPool from '../../config/dbPool.js';

export async function deleteWorkBlockRecord(workBlockRecordId: number) {
  const query = `
    DELETE FROM WORK_PERIODS 
    WHERE id=$1;
  `;
  const values = [workBlockRecordId];
  try {
    const result = await dbPool.query(query, values);
    return true;
  } catch (error) {
    throw new Error('Unable to remove the record.');
  }
}
