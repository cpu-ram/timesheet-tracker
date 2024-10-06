import { addWorkBlockRecord, getDefaultJobsiteProperties } from '../repositories/workBlockRepository.js';

export function generateDefaultWeeklyWorkRecords(jobId, employeeId) {
  const defaultProperties = getDefaultJobsiteProperties(jobId);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentDayOfWeek = currentDate.getDay();

  const initialDay = currentDate;
  if (currentDayOfWeek == 1 || currentDayOfWeek == 0) {
    initialDay.setDate(currentDate.getDate() - currentDayOfWeek - 6);
  } else initialDay.setDate(currentDate.getDate() - currentDayOfWeek + 1);

  const workWeekDaysArray = [
    initialDay,
    new Date(initialDay).setDate(initialDay.getDate() + 1),
    new Date(initialDay).setDate(initialDay.getDate() + 2),
    new Date(initialDay).setDate(initialDay.getDate() + 3),
    new Date(initialDay).setDate(initialDay.getDate() + 4),
  ];

  for (const day of workWeekDaysArray) {
    const startTime = new Date(day);
    startTime.setHours(defaultProperties.startTime.hours);
    startTime.setMinutes(defaultProperties.startTime.minutes);
    const endTime = new Date(day);
    endTime.setHours(defaultProperties.endTime.hours);
    endTime.setMinutes(defaultProperties.endTime.minutes);

    addWorkBlockRecord(
      startTime,
      endTime,
      jobId,
      employeeId,
    )
  }

}
