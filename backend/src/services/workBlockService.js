import {
  getWorkBlockRecords, addWorkBlockRecord, deleteWorkBlockRecord,
  getDefaultJobsitePropertiesRecord, addProjectRecord, addEmployeeRecord,
} from '../repositories/workBlockRepository.js';

export const getWorkBlocks = (
  employeeId,
  reportedById,
  startDateTime,
  endDateTime,
) => getWorkBlockRecords(employeeId, reportedById, startDateTime, endDateTime);

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

export async function getDefaultJobsiteProperties(jobId) {
  const defaultProperties = await getDefaultJobsitePropertiesRecord(jobId);
  const renameMap = {
    default_work_start_time: 'workStartTime',
    default_work_end_time: 'workEndTime',
    default_break_start_time: 'breakStartTime',
    default_break_end_time: 'breakEndTime',
  };

  const result = Object.fromEntries(
    Object.entries(defaultProperties).map(([key, value]) => {
      const newKey = renameMap[key];
      if (value) {
        const [hours, minutes] = value.split(':').map(Number);
        return [newKey, { hours, minutes }];
      }
      return [newKey, null];
    }),
  );
  return result;
}

export function addProject(
  id,
  type = null,
  address = null,
  name = null,
  supervisorId = null,
  defaultWorkStartTime = null,
  defaultWorkEndTime = null,
  defaultBreakStartTime = null,
  defaultBreakEndTime = null,
) {
  return addProjectRecord(
    id,
    type,
    address,
    name,
    supervisorId,
    defaultStartTime,
    defaultEndTime,
    defaultBreakStartTime,
    defaultBreakEndTime,
  );
}

export function addEmployee(
  employee_name = null,
  employee_nickname = null,
  title = null,
  email = null,
) {
  return addEmployeeRecord();
}
