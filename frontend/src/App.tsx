import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { User } from './types/userType.tsx';
import UserSelectorPage from './pages/UserSelectorPage.tsx';
import TimesheetPage from './pages/TimesheetPage.tsx';
import { GlobalStyles } from '@mui/material';

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <GlobalStyles
        styles={{
          '*': { boxSizing: 'border-box' },
          body: {
            padding: '0.5em 0.5em !important',
            margin: '0 !important'
          },
        }}
      />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              selectedUser ?
                (<Navigate to="/timesheet" />)
                :
                (<Navigate to="/select-user" />)
            }
          />

          <Route
            path="/select-user"
            element={
              <UserSelectorPage
                {...{ selectedUser, setSelectedUser }}
              />
            }
          />

          <Route
            path="/timesheet"
            element={
              selectedUser ?
                (<TimesheetPage selectedUser={selectedUser} />) :
                (<Navigate to="/select-user" />)
            }
          />

        </Routes>
      </Router>
    </>
  )
}

export default App;
