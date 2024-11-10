import chalk from 'chalk';
import { input } from '@inquirer/prompts';
import WorkBlock from '../models/WorkBlock.js';

function italic(x) {
  return chalk.italic(x);
}

async function promptUser() {
  const result = {};
  const elements = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

  for (const element of elements) {
    result[element] = await promptTime(element);
  }
  return result;
}

async function promptTime(timeName) {
  const result = await input({
    message: `Enter ${timeName} in ${italic('HH:mm')} or ${italic('hh:mm am / hh:mm pm')}`
  });
  return result;
}

export default (async () => {
  const userInput = await promptUser();
  console.log(userInput);
});
