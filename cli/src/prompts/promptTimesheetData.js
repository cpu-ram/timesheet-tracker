import chalk from 'chalk';
import { input, confirm } from '@inquirer/prompts';

import promptWorkBlockData from './promptWorkBlockData';
import { generateWorkWeekDays } from '../../../utils/dateUtils.js';

function italic(x) {
  return chalk.italic(x);
}

async function promptTimesheetData() {
  const workWeekDaysArray = generateWorkWeekDays();
  let timesheet = [];

  console.log("Let's fill in the timesheet for the five days of the past week:");
  const workWeekDaysString = workWeekDaysArray.reduce((acc, day) => {
    acc += (day.toDateString() + '\n');
    return acc;
  }, "")
  console.log(workWeekDaysString);

  for (const day of workWeekDaysArray) {
    console.log(`Entering data for ${italic(day)}:`);
    const dayData = await promptDayData(day);
    timesheet.push({ day, dayData });
  }

  return timesheet;
}

async function promptDayData(day) {
  const workBlocks = [];
  let continueEnteringWorkBlocks = true;
  while (continueEnteringWorkBlocks) {
    continueEnteringWorkBlocks = await confirm({
      message: `Would you like to add a work block to this day, ${italic(day)}?`,
      default: true,
    })
    if (!continueEnteringWorkBlocks) return workBlocks;
    const workBlock = await promptWorkBlockData();
    workBlocks.push(workBlock);
  }
}

export default promptTimesheetData;
