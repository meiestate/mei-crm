import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (error) {
      console.error("Failed to read theme from localStorage:", error);
    }

    return "light";
  });

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

    const theme = getTheme(mode);
    document.body.style.background = theme.pageBg;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = theme.typography.fontFamily;
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <LoginPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/leads"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/leads/:id"
          element={
            <LeadDetailPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/contacts"
          element={
            <ContactsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/deals"
          element={
            <DealsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/tasks"
          element={
            <TasksPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <SettingsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}