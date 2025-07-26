import { TimesheetDayRecord } from '../types/TimesheetDayRecord.js';
import { Dispatch, SetStateAction } from 'react';

function updateWorkData(
  newWorkData: TimesheetDayRecord[],
  setWorkData: Dispatch<SetStateAction<TimesheetDayRecord[]>>,
): void {
  setWorkData(prevWorkData =>
    prevWorkData.map(prevWorkDay => {
      const matchingFetchedDay = newWorkData.find(fetchedDay =>
        fetchedDay.date.equals(prevWorkDay.date),
      );
      return matchingFetchedDay ?? prevWorkDay;
    }),
  );
}

export default updateWorkData;
