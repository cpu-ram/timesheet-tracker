import chalk from 'chalk';
import { input, confirm } from '@inquirer/prompts';
import WorkBlock from '../models/WorkBlock.js';

function italic(x) {
  return chalk.italic(x);
}

async function promptUser() {
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
  const result = await input({
    message: `Enter ${timeName} in ${italic('HH:mm')} or ${italic('hh:mm am / hh:mm pm')}`
  });
  return result;
}

export default promptUser;
