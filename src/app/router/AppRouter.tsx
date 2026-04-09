import { Navigate, Route, Routes } from "react-router-dom";
import type { ThemeMode } from "../theme";

import ProtectedRoute from "./ProtectedRoute";

import DashboardPage from "../pages/dashboard/DashboardPage";
import LeadsPage from "../pages/leads/LeadsPage";
import LeadDetailPage from "../pages/leads/LeadDetailPage";
import ContactsPage from "../pages/contacts/ContactsPage";
import DealsPage from "../pages/deals/DealsPage";
import TasksPage from "../pages/tasks/TasksPage";
import CallLogPage from "../pages/calls/CallLogPage";
import HelpSupportPage from "../pages/help/HelpSupportPage";
import SettingsPage from "../pages/settings/SettingsPage";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import EmailVerificationPage from "../pages/auth/EmailVerificationPage";
import MobileOtpVerificationPage from "../pages/auth/MobileOtpVerificationPage";
import OnboardingWelcomePage from "../pages/auth/OnboardingWelcomePage";

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
  onLogout,
}: AppRouterProps) {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
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
            <Navigate to="/dashboard" replace />
          ) : (
            <SignupPage mode={mode} onToggleTheme={onToggleTheme} />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPasswordPage mode={mode} onToggleTheme={onToggleTheme} />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ResetPasswordPage mode={mode} onToggleTheme={onToggleTheme} />
          )
        }
      />

      <Route
        path="/verify-email"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <EmailVerificationPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          )
        }
      />

      <Route
        path="/verify-mobile"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <MobileOtpVerificationPage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          )
        }
      />

      <Route
        path="/welcome"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <OnboardingWelcomePage
              mode={mode}
              onToggleTheme={onToggleTheme}
            />
          )
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LeadsPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads/:leadId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LeadDetailPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ContactsPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deals"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DealsPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TasksPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/calls"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CallLogPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help-support"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <HelpSupportPage mode={mode} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SettingsPage
              mode={mode}
              onToggleTheme={onToggleTheme}
              onLogout={onLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}