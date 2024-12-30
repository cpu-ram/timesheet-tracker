import Calendar from '../components/Calendar.tsx';
import { capitalize } from 'lodash';

const TimesheetPage = ({ selectedUser }) => {
  return (
    <div>
      <p>
        Hello, {capitalize(selectedUser.nickname)}
        <Calendar>

        </Calendar>
      </p>
    </div>
  )
}

export default TimesheetPage;
