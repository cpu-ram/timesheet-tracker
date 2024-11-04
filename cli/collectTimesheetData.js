import chalk from 'chalk';
import input from '@inquirer/prompts';
import { startOfDay, endOfDay } from 'date-fns';

function italic(x) { return chalk.italic(x); }

export default class WorkBlock {
  date;

  workStartTime;

  workEndTime;

  breakStartTime;

  breakEndTime;

  jobId;

  constructor() {
    this.promptUser();
  }

  static async promptUser() {
    const result = {};
    const elements = ['workStartTime', 'workEndTime', 'breakStartTime', 'breakEndTime'];

    elements.forEach(async (element) => {
      result[element] = await this.promptTime(element);
    });

    return result;
  }

  static async promptTime(timeName) {
    const result = input(
      `Enter ${timeName} in ${italic('HH:mm')} or ${italic('hh:mm am / hh:mm pm')} `,
    );
    return result;
  }
}
