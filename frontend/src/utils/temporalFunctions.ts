import { Temporal } from '@js-temporal/polyfill';

export const startOfWeek = (date: Temporal.PlainDate, { weekStartsOn }: { weekStartsOn: number } = { weekStartsOn: 1 }) => {
  if (!date) {
    throw new TypeError("Date is missing");
  }

  if (!(weekStartsOn >= 1 && weekStartsOn <= 7 && Number.isInteger(weekStartsOn))) {
    throw new RangeError("weekStartsOn must be between 1 and 7");
  }

  const dateNegativeAdjustment = (date.dayOfWeek - weekStartsOn + 7) % 7;

  return date.subtract({
    days: dateNegativeAdjustment
  });
}

export const addDays = (date: Temporal.PlainDate, days: number) => {

  if (!date && !days) {
    throw new TypeError("Date or days are missing");
  }

  return date.add({
    days: days
  });


}

export const convertDateToPlainTime = (date: Date) => {
  if (!date) {
    throw new TypeError("Date is missing");
  }
  return Temporal.PlainTime.from({
    hour: date.getHours(),
    minute: date.getMinutes(),
  });
}

export const convertPlainTimeToDate = (time: Temporal.PlainTime) => {
  if (!time) {
    throw new TypeError("Time is missing");
  }
  return new Date(0, 0, 0, time.hour, time.minute);
}
