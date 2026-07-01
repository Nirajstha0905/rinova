import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LeadPage from "../pages/leads/LeadPage";
import StudentPage from "../pages/students/StudentPage";
import StudentProfilePage from "../pages/students/StudentProfilePage/StudentProfilePage";
import ApplicationPage from "../pages/applications/ApplicationPage";
import DocumentPage from "../pages/documents/DocumentPage";
import TaskPage from "../pages/tasks/TaskPage";
import ReportPage from "../pages/reports/ReportPage";
import NotificationPage from "../pages/notifications/NotificationPage";
import SettingsPage from "../pages/settings/Settings";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadPage />} />
        <Route
          path="/students"
          element={
            <ProtectedRoute
              requiredRoles={[
                "Super Admin",
                "Consultancy Admin",
                "Counsellors",
                "Documentation Officers",
              ]}
            >
              <StudentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute
              requiredRoles={[
                "Super Admin",
                "Consultancy Admin",
                "Counsellors",
                "Documentation Officers",
              ]}
            >
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/applications" element={<ApplicationPage />} />
        <Route path="/documents" element={<DocumentPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredRoles={["Super Admin"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
