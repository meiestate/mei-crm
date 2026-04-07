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
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import OnboardingWelcomePage from "./pages/onboarding/OnboardingWelcomePage";
import CallLogPage from "./pages/calls/CallLogPage";

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

  const loginPageElement = (
    <LoginPage
      mode={mode}
      onToggleTheme={toggleTheme}
      onLoginSuccess={handleLoginSuccess}
    />
  );

  const onboardingPageElement = (
    <OnboardingWelcomePage
      mode={mode}
      onComplete={handleOnboardingComplete}
      onSkip={handleOnboardingComplete}
    />
  );

  const dashboardPageElement = (
    <DashboardPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const leadsPageElement = (
    <LeadsPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const addLeadPageElement = <AddLeadPage mode={mode} />;

  const leadsCalendarPageElement = (
    <LeadsCalendarPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const leadDetailPageElement = (
    <LeadDetailPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const contactsPageElement = (
    <ContactsPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const dealsPageElement = (
    <DealsPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const dealDetailPageElement = (
    <DealDetailPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const tasksPageElement = (
    <TasksPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const taskDetailPageElement = (
    <TaskDetailPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const settingsPageElement = (
    <SettingsPage mode={mode} onToggleTheme={toggleTheme} />
  );
  <Route path="/calls" element={<CallLogPage mode={mode} />} />

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? hasCompletedOnboarding
                    ? "/dashboard"
                    : "/onboarding"
                  : "/login"
              }
              replace
            />
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                <Navigate to="/dashboard" replace />
              ) : (
                onboardingPageElement
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate
                to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                replace
              />
            ) : (
              <SignupPage mode={mode} />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate
                to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                replace
              />
            ) : (
              <ForgotPasswordPage mode={mode} />
            )
          }
        />

        <Route
          path="/reset-password"
          element={
            isAuthenticated ? (
              <Navigate
                to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                replace
              />
            ) : (
              <ResetPasswordPage mode={mode} />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"}
                replace
              />
            ) : (
              loginPageElement
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                dashboardPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                leadsPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads/new"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                addLeadPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads/calendar"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                leadsCalendarPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads/:id"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                leadDetailPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/contacts"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                contactsPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/deals"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                dealsPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/deals/:id"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                dealDetailPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                tasksPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/tasks/:id"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                taskDetailPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              hasCompletedOnboarding ? (
                settingsPageElement
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? hasCompletedOnboarding
                    ? "/dashboard"
                    : "/onboarding"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}