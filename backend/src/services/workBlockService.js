import {
  getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord
} from '../repositories/workBlockRepository.js';

export async function getWorkBlocks(
  employeeId,
  reportedById,
  startDateTime,
  endDateTime,
) {
  let queryResult = undefined;
  try {
    queryResult = await getWorkBlockRecords(employeeId, reportedById, startDateTime, endDateTime);
  }
  catch (error) { throw new Error(error); }
  if (queryResult.rowCount === 0) return null;

  const renameMap = {
    work_period_id: 'workBlockId',
    project_id: 'jobsiteId',
    reported_by: 'reportedBy',
    employee_id: 'employeeId',
    work_start: 'workStartTime',
    work_end: 'workEndTime',
    break_start: 'breakStartTime',
    break_end: 'breakEndTime',
    temp_location: 'tempLocation',
    supervisor_id: 'supervisorId',
    temp_jobsite_description: 'tempJobsiteDescription',
  };

  let result = queryResult.map(x => {
    return Object.fromEntries(
      Object.entries(x).map(([oldKey, value]) => {
        if (renameMap.hasOwnProperty(oldKey)) {
          return [renameMap[oldKey], value];
        }
        else return [oldKey, value];
      })
    );
  })

  return result;
}

export const addWorkBlock = (
  employeeId,
  reportedById,
  projectId = null,
  startDateTime = null,
  endDateTime = null,
  breakStartTime = null,
  breakEndTime = null,
  date = null,
) => {
  addWorkBlockRecord(
    employeeId,
    reportedById,
    projectId,
    startDateTime,
    endDateTime,
    breakStartTime,
    breakEndTime,
    date,
  );
};

export const deleteWorkBlock = (workBlockId) => deleteWorkBlockRecord(workBlockId);
