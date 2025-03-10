import { Routes, Route, Navigate } from 'react-router-dom';
import TimesheetPage from '../pages/TimesheetPage.tsx';
import ReportPage from '../pages/ReportPage.tsx';
import ChangeNamePage from '../pages/ChangeNamePage.tsx';

const AuthenticatedRoutes = () => {
  return (
    <Routes>

      <Route
        path="/timesheet"
        element={
          (<TimesheetPage />)
        }
      />

      <Route
        path="/reports/weekly"
        element={
          <ReportPage />
        }
      />

      <Route
        path="/profile/change-name"
        element={
          <ChangeNamePage />
        }
      />

      <Route
        path="*"
        element={
          <Navigate to="/timesheet" />
        }
      />

    </Routes>
  )
}

export default AuthenticatedRoutes;