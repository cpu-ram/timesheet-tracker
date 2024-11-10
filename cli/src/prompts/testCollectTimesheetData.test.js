import collectData from './collectTimesheetData.js';

const data = await collectData();
test('collectTimesheetData', () => {
  expect(data).toBeTruthy();
});