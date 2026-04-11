import { Navigate, Route, Routes } from "react-router-dom";
import type { ThemeMode } from "../../theme";

import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "../../pages/dashboard/DashboardPage";
import LeadsPage from "../../pages/leads/LeadsPage";
import LeadDetailPage from "../../pages/leads/LeadDetailPage";
import ContactsPage from "../../pages/contacts/ContactsPage";
import DealsPage from "../../pages/deals/DealsPage";
import TasksPage from "../../pages/tasks/TasksPage";
import CallLogPage from "../../pages/calls/CallLogPage";
import SettingsPage from "../../pages/settings/SettingsPage";

import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";
import EmailVerificationPage from "../../pages/auth/EmailVerificationPage";
import MobileOtpVerificationPage from "../../pages/auth/MobileOtpVerificationPage";

type AppRouterProps = {
  mode: ThemeMode;
  isAuthenticated: boolean;
  onToggleTheme: () => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
};

export default function AppRouter({
  mode,
  isAuthenticated,
  onToggleTheme,
  onLoginSuccess,
}: AppRouterProps) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage
              mode={mode}
              onToggleTheme={onToggleTheme}
              onLoginSuccess={onLoginSuccess}
            />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <SignupPage mode={mode} />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage mode={mode} />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage mode={mode} />}
      />

      <Route
        path="/verify-email"
        element={<EmailVerificationPage mode={mode} />}
      />

      <Route
        path="/verify-mobile"
        element={<MobileOtpVerificationPage mode={mode} />}
      />

      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route
          path="/"
          element={
            <DashboardPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/leads"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/leads/:id"
          element={
            <LeadDetailPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/contacts"
          element={
            <ContactsPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/deals"
          element={
            <DealsPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/tasks"
          element={
            <TasksPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/calls"
          element={
            <CallLogPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <SettingsPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}