import dotenv from 'dotenv';
import generateDefaultWeeklyWorkRecords from '../src/services/generateDefaultWeeklyWorkRecordsService.js';

dotenv.config();

async function run() {
  const date = new Date();
  if (date.getDay() > 1) {
    date.setDate(date.getDate() - date.getDay() + 7);
  } else {
    date.setDate(date.getDate() - date.getDay());
  }

  await generateDefaultWeeklyWorkRecords(process.env.JOB_ID, 10);
}

run();
