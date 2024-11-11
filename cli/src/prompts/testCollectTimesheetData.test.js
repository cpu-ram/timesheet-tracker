import promptData from './promptTimesheetData.js';

const data = await promptData();
console.log(data);
test('promptTimesheetData', () => {
  expect(data).toBeTruthy();
});