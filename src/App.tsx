import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import DashboardPage from "./pages/dashboard/DashboardPage";
import LeadsPage from "./pages/leads/LeadsPage";
import AddLeadPage from "./pages/leads/AddLeadPage";
import LeadsCalendarPage from "./pages/leads/LeadsCalendarPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import DealsPage from "./pages/deals/DealsPage";
import DealDetailPage from "./pages/deals/DealDetailPage";
import TasksPage from "./pages/tasks/TasksPage";
import TaskDetailPage from "./pages/tasks/TaskDetailPage";
import SettingsPage from "./pages/settings/SettingsPage";
import BillingSubscriptionPage from "./pages/settings/BillingSubscriptionPage";
import HelpSupportPage from "./pages/support/HelpSupportPage";
import CallLogPage from "./pages/calls/CallLogPage";
import PipelinesPage from "./pages/pipelines/PipelinesPage";
import RolesPage from "./pages/settings/RolesPage";
import UsersPage from "./pages/settings/UsersPage";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OnboardingWelcomePage from "./pages/onboarding/OnboardingWelcomePage";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import ProtectedRoute from "./app/router/ProtectedRoute";

import type { ThemeMode } from "./theme";
import { getTheme } from "./theme";

const THEME_STORAGE_KEY = "mei-crm-theme";
const AUTH_STORAGE_KEY = "mei-crm-auth";
const ONBOARDING_STORAGE_KEY = "mei_crm_onboarding_completed";

function getInitialTheme(): ThemeMode {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch (error) {
    console.error("Failed to read theme from localStorage:", error);
  }

  return "light";
}

function isUserAuthenticated() {
  try {
    return (
      localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
      sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
    );
  } catch (error) {
    console.error("Failed to read auth state:", error);
    return false;
  }
}

function isOnboardingCompleted() {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
  } catch (error) {
    console.error("Failed to read onboarding state:", error);
    return false;
  }
}

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    isUserAuthenticated()
  );
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean>(() => isOnboardingCompleted());

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }

    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }

    document.body.style.background = theme.pageBg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = theme.typography.fontFamily;
  }, [mode, theme]);

  useEffect(() => {
    const syncAppState = () => {
      setIsAuthenticated(isUserAuthenticated());
      setHasCompletedOnboarding(isOnboardingCompleted());
    };

    syncAppState();
    window.addEventListener("storage", syncAppState);

    return () => {
      window.removeEventListener("storage", syncAppState);
    };
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (error) {
      console.error("Failed to save onboarding state:", error);
    }

    setHasCompletedOnboarding(true);
  };

  const defaultProtectedRedirect = hasCompletedOnboarding
    ? "/dashboard"
    : "/onboarding";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? defaultProtectedRedirect : "/login"}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={defaultProtectedRedirect} replace />
            ) : (
              <LoginPage
                mode={mode}
                onToggleTheme={toggleTheme}
                onLoginSuccess={handleLoginSuccess}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to={defaultProtectedRedirect} replace />
            ) : (
              <SignupPage mode={mode} />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to={defaultProtectedRedirect} replace />
            ) : (
              <ForgotPasswordPage mode={mode} />
            )
          }
        />

        <Route
          path="/reset-password"
          element={
            isAuthenticated ? (
              <Navigate to={defaultProtectedRedirect} replace />
            ) : (
              <ResetPasswordPage mode={mode} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <OnboardingWelcomePage
                  mode={mode}
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingComplete}
                />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              redirectPath="/login"
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              hasCompletedOnboarding ? (
                <DashboardPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/leads"
            element={
              hasCompletedOnboarding ? (
                <LeadsPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/leads/new"
            element={
              hasCompletedOnboarding ? (
                <AddLeadPage mode={mode} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/leads/calendar"
            element={
              hasCompletedOnboarding ? (
                <LeadsCalendarPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/leads/:id"
            element={
              hasCompletedOnboarding ? (
                <LeadDetailPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/contacts"
            element={
              hasCompletedOnboarding ? (
                <ContactsPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/deals"
            element={
              hasCompletedOnboarding ? (
                <DealsPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/deals/:id"
            element={
              hasCompletedOnboarding ? (
                <DealDetailPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/pipelines"
            element={
              hasCompletedOnboarding ? (
                <PipelinesPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/tasks"
            element={
              hasCompletedOnboarding ? (
                <TasksPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/tasks/:id"
            element={
              hasCompletedOnboarding ? (
                <TaskDetailPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/calls"
            element={
              hasCompletedOnboarding ? (
                <CallLogPage mode={mode} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/help-support"
            element={
              hasCompletedOnboarding ? (
                <HelpSupportPage mode={mode} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/settings"
            element={
              hasCompletedOnboarding ? (
                <SettingsPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/settings/billing"
            element={
              hasCompletedOnboarding ? (
                <BillingSubscriptionPage mode={mode} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/settings/roles"
            element={
              hasCompletedOnboarding ? (
                <RolesPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />

          <Route
            path="/settings/users"
            element={
              hasCompletedOnboarding ? (
                <UsersPage mode={mode} onToggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            }
          />
        </Route>

        <Route
          path="*"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                <NotFoundPage />
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}