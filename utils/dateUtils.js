function generateWorkWeekDays() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const currentDayOfWeek = currentDate.getDay();

  const initialDay = currentDate;
  if (currentDayOfWeek === 1 || currentDayOfWeek === 0) {
    initialDay.setDate(currentDate.getDate() - currentDayOfWeek - 6);
  } else initialDay.setDate(currentDate.getDate() - currentDayOfWeek + 1);

  const workWeekDaysArray = [
    initialDay,
    new Date(initialDay).setDate(initialDay.getDate() + 1),
    new Date(initialDay).setDate(initialDay.getDate() + 2),
    new Date(initialDay).setDate(initialDay.getDate() + 3),
    new Date(initialDay).setDate(initialDay.getDate() + 4),
  ];

  return workWeekDaysArray;
}


