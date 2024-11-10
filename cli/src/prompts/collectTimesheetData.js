import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import WorkBlock from '../models/WorkBlock.js';
// import { startOfDay, endOfDay } from 'date-fns';

function italic(x) { return chalk.italic(x); }

async function promptUser() {
  const result = {};
  const elements = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

  elements.forEach(async (element) => {
    result[element] = await this.promptTime(element);
  });

  return result;
}

async function promptTime(timeName) {
  const result = input(
    `Enter ${timeName} in ${italic('HH:mm')} or ${italic('hh:mm am / hh:mm pm')} `,
  );
  return result;
}
