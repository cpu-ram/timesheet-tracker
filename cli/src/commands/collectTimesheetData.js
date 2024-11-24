import promptTimesheetData from '../prompts/promptTimesheetData.js';

const data = await promptTimesheetData();
console.log(data);