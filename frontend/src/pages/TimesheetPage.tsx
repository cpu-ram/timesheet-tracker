import Calendar from '../components/Calendar.tsx';

const TimesheetPage = ({ selectedUser }) => {
  return (
    <div>
      <p>
        You are logged in as {selectedUser.nickname}
        <Calendar>

        </Calendar>
      </p>
    </div>
  )
}

export default TimesheetPage;
