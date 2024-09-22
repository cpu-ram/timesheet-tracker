import workBlockRecords from './sampleWorkBlocks.json' assert { type: 'json' };

export const getWorkBlockRecords = (
  employeeId,
  startDate,
  endDate,
) => workBlockRecords.filter(
  (element) => element.employeeId === employeeId
    && new Date(element.startTime) >= new Date(startDate)
    && new Date(element.endTime) <= new Date(endDate),
);

export const addWorkBlockRecord = (
  startTime,
  endTime,
  jobId,
  employeeId,
) => {
  const newId = workBlockRecords.map((x) => x.id).reduce((x, y) => Math.max(x, y), 0) + 1;
  workBlockRecords.push({
    id: newId,
    startTime: new DateTime(startTime),
    endTime: new DateTime(endTime),
    jobId,
    employeeId,
  });
};

export function deleteWorkBlockRecord() {
  const index = workBlockRecords.findIndex((x) => x.id === workBlockRecordId);
  if (index !== -1) {
    workBlockRecords.splice(index, 1);
    return true;
  }
  return false;
}
