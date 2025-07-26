import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from '../contexts/NotificationContext.tsx';

import TimesheetPage from '../pages/TimesheetPage.tsx';
import ReportPage from '../pages/ReportPage/ReportPage.tsx';
import JobsitePage from '../pages/Jobsite/JobsitePage.tsx';
import JobsiteListPage from '../pages/Jobsite/JobsiteListPage.tsx';
import ChangeNamePage from '../pages/ChangeNamePage.tsx';

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route
        path="/timesheet"
        element={
          <NotificationProvider>
            <TimesheetPage />
          </NotificationProvider>
        }
      />

      <Route path="/reports/weekly" element={<ReportPage />} />

      <Route path="/jobsites/new/" element={<JobsitePage initialMode="add" />} />

      <Route path="/jobsites/:jobsiteId" element={<JobsitePage initialMode="view" />} />

      <Route path="/jobsites/" element={<JobsiteListPage />} />

      <Route path="/profile/change-name" element={<ChangeNamePage />} />

      <Route path="*" element={<Navigate to="/timesheet" />} />
    </Routes>
  );
};

export default AuthenticatedRoutes;
