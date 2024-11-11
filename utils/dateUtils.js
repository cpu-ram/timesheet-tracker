export function generateWorkWeekDays() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentDayOfWeek = currentDate.getDay();

  const initialDay = currentDate;
  if (currentDayOfWeek === 1 || currentDayOfWeek === 0) {
    initialDay.setDate(currentDate.getDate() - currentDayOfWeek - 6);
  } else initialDay.setDate(currentDate.getDate() - currentDayOfWeek + 1);

  const workWeekDaysArray = [
    initialDay,
    new Date(initialDay.getTime() + 1 * 24 * 60 * 60 * 1000),
    new Date(initialDay.getTime() + 2 * 24 * 60 * 60 * 1000),
    new Date(initialDay.getTime() + 3 * 24 * 60 * 60 * 1000),
    new Date(initialDay.getTime() + 4 * 24 * 60 * 60 * 1000),
  ];

  return workWeekDaysArray;
}


