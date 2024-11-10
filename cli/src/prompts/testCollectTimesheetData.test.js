import collectData from './collectTimesheetData.js';

const data = await collectData();
console.log(data);
test('collectTimesheetData', () => {
  expect(data).toBeTruthy();
});