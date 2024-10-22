import { addWorkBlock, getDefaultJobsiteProperties } from './workBlockService.js';
import { format } from 'date-fns';

export async function generateDefaultWeeklyWorkRecords(jobId, employeeId) {
  const defaultProperties = await getDefaultJobsiteProperties(jobId);

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
    startTime.setHours(defaultProperties.workStartTime.hours);
    startTime.setMinutes(defaultProperties.workStartTime.minutes);
    const endTime = new Date(day);
    endTime.setHours(defaultProperties.workEndTime.hours);
    endTime.setMinutes(defaultProperties.workEndTime.minutes);

    addWorkBlock(
      employeeId,
      employeeId,
      jobId,
      startTime,
      endTime,
      null,
      null,
      format(startTime, 'yyyy-MM-dd'),
    );
  }
}
