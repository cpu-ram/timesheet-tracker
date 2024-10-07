import pool from '../config/db.js';

export function deleteWorkBlockRecord(workBlockRecordId) {
  const index = workBlockRecords.findIndex((x) => x.id === workBlockRecordId);
  if (index !== -1) {
    workBlockRecords.splice(index, 1);
    return true;
  }
  return false;
}