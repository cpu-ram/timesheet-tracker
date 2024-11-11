import chalk from 'chalk';
import { input, confirm } from '@inquirer/prompts';
import { DateTime } from 'luxon';
import WorkBlock from '../models/WorkBlock.js';

function italic(x) {
  return chalk.italic(x);
}

async function promptWorkBlockData() {
  const result = {};

  result['workStartTime'] = await promptTime('work start time');
  result['workEndTime'] = await promptTime('work end time');

  const hadBreak = await confirm(
    {
      message: 'Did you take a break?',
      default: false,
    }
  );

  if (hadBreak) {
    result['breakStartTime'] = await promptTime('break start time');
    result['breakEndTime'] = await promptTime('break end time');
  }

  return result;
}

async function promptTime(timeName) {
  let properTimeEntered = false;

  let time = undefined;
  let entry = undefined;
  while (!properTimeEntered) {
    entry = await input({
      message: `Enter ${timeName} in the ${italic('\"military format\"')}  — HH:mm')}`
    });
    if ((entry) === '') return null;
    try {
      time = parseTime(entry);
      properTimeEntered = true;
    }
    catch (argumentError) {
      console.log(chalk.red(argumentError.message));
      continue;
    }
  }
  return time;
}

function parseTime(input) {
  const luxonTime = DateTime.fromFormat(input, 'HH:mm');
  if (!luxonTime.isValid) {
    throw new Error("Invalid time format. Please use HH:mm");
  }
  return { hours: luxonTime.hour, minutes: luxonTime.minute };
}

export default promptWorkBlockData;
