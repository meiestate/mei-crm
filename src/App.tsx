import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import DashboardPage from "./pages/dashboard/DashboardPage";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import DealsPage from "./pages/deals/DealsPage";
import TasksPage from "./pages/tasks/TasksPage";
import SettingsPage from "./pages/settings/SettingsPage";
import LoginPage from "./pages/auth/LoginPage";

import type { ThemeMode } from "./theme";
import { getTheme } from "./theme";

const THEME_STORAGE_KEY = "mei-crm-theme";
const AUTH_STORAGE_KEY = "mei-crm-auth";

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

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    isUserAuthenticated()
  );

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
    const syncAuthState = () => {
      setIsAuthenticated(isUserAuthenticated());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const loginPageElement = (
    <LoginPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const dashboardPageElement = (
    <DashboardPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const leadsPageElement = (
    <LeadsPage mode={mode} onToggleTheme={toggleTheme} />
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

  const tasksPageElement = (
    <TasksPage mode={mode} onToggleTheme={toggleTheme} />
  );

  const settingsPageElement = (
    <SettingsPage mode={mode} onToggleTheme={toggleTheme} />
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              loginPageElement
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              dashboardPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads"
          element={
            isAuthenticated ? (
              leadsPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/leads/:id"
          element={
            isAuthenticated ? (
              leadDetailPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/contacts"
          element={
            isAuthenticated ? (
              contactsPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/deals"
          element={
            isAuthenticated ? (
              dealsPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/tasks"
          element={
            isAuthenticated ? (
              tasksPageElement
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              settingsPageElement
            ) : (
              <Navigate to="/login" replace />
            )
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
    </BrowserRouter>
  );
}