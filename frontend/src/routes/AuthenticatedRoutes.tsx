import { Routes, Route, Navigate } from 'react-router-dom';
import TimesheetPage from '../pages/TimesheetPage.tsx';
import ReportPage from '../pages/ReportPage.tsx';
import AddJobsiteForm from '../components/Jobsite/AddJobsiteForm/AddJobsiteForm.tsx';
import JobsitePage from '../pages/Jobsite/jobsitePage.tsx';
import JobsiteListPage from '../pages/Jobsite/JobsiteListPage.tsx';
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
        path="/jobsites/new/"
        mode="add"
        element={
          <JobsitePage
            initialMode="add"
          />
        }
      />

      <Route
        path="/jobsites/:jobsiteId"
        element={
          <JobsitePage
            initialMode="view"
          />
        }
      />

      <Route
        path="/jobsites/"
        element={
          <JobsiteListPage />
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