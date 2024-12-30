import { useState } from 'react';
import { startOfDay } from 'date-fns';
import Calendar from '../components/Calendar.tsx';
import { capitalize } from 'lodash';

const TimesheetPage = ({ selectedUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(startOfDay(new Date()));

  return (
    <div>
      <span>
        Hello, {capitalize(selectedUser.nickname)}
        <Calendar {...{ selectedDate, setSelectedDate }}>
        </Calendar>
      </span>
    </div>
  )
}

export default TimesheetPage;
