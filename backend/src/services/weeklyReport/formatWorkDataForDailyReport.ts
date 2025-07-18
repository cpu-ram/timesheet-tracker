import { Temporal } from '@js-temporal/polyfill';
import { WorkBlock } from '../../types/WorkBlock.js';
import { FormattedWorkBlock } from '../../types/FormattedWorkBlock.js';

export function formatWorkDataForDailyReport(workBlockArray: WorkBlock[]): FormattedWorkBlock[] {
  if (!workBlockArray || workBlockArray.length === 0) {
    throw new RangeError('No work blocks provided');
  }

  function calculateHours(startTime: Temporal.PlainTime, endTime: Temporal.PlainTime) {
    if (!startTime || !endTime) {
      throw new RangeError('Start time and end time are required');
    }
    if (Temporal.PlainTime.compare(startTime, endTime) > 0) {
      throw new RangeError('Start time must be before end time');
    }

    let interval = startTime.until(endTime, { largestUnit: 'hours', smallestUnit: 'minutes' });
    const totalMinutes = interval.hours * 60 + interval.minutes;
    return Math.round(totalMinutes / 60 * 10) / 10;
  }
  function formatTime(time: Temporal.PlainTime) {
    if (!time) {
      return '-';
    }
    return time.toLocaleString('en-US', { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  function formatDate(date: Temporal.PlainDate) {
    if (!date) {
      return '-';
    }

    let dateString = date.toLocaleString('en-US',
      {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }
    );

    let [weekday, monthDay] = dateString.split(', ');
    let result = `${monthDay} ${weekday}`;
    return result;
  }

  let formattedWorkBlocks: FormattedWorkBlock[] = workBlockArray.map(
    function (workBlock: WorkBlock) {
      if (!workBlock || !workBlock.date) {
        throw new RangeError('Invalid work block data');
      }

      let formattedWorkBlock: FormattedWorkBlock = {
        jobsiteId: workBlock.jobsiteId ? workBlock.jobsiteId.
          toUpperCase() : '—',
        date: formatDate(workBlock.date),
        hours: workBlock.workBlockStart && workBlock.workBlockEnd ?
          calculateHours(workBlock.workBlockStart, workBlock.workBlockEnd)
          :
          0,
        jobsiteDetails: workBlock.jobsiteName || workBlock.jobsiteAddress || '—',
        workBlockStart: workBlock.workBlockStart ? formatTime(workBlock.workBlockStart) : '-',
        workBlockEnd: workBlock.workBlockEnd ? formatTime(workBlock.workBlockEnd) : '-',
        breakStart: workBlock.workBlockEnd ? formatTime(workBlock.workBlockEnd) : '-',
        breakEnd: workBlock.workBlockEnd ? formatTime(workBlock.workBlockEnd) : '-',
      };

      return formattedWorkBlock;
    }

  );

  return formattedWorkBlocks;
}
