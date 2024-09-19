import { getWorkBlocks } from './workBlockService.js';

export default generateWeeklyReport = (
  (employeeId, payPeriodEndDate) => {
    if (payPeriodEndDate.getDay() !== 0) throw new Error('payPeriodEndDate must be a Sunday');

    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const beginningOfFinalDay = new Date(payPeriodEndDate.setHours(0, 0, 0, 0));
    const endOfFinalDay = new Date(
      beginningOfFinalDay.getTime() + millisecondsInDay - 1000,
    );
    const beginningOfFirstDay = new Date(beginningOfFinalDay.getTime() - 6 * millisecondsInDay);
    return getWorkBlocks(employeeId, beginningOfFirstDay, endOfFinalDay);
  }
);
