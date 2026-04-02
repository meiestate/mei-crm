import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardPage from "./pages/dashboard/DashboardPage";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import ContactsPage from "./pages/contacts/ContactsPage";
import DealsPage from "./pages/deals/DealsPage";
import TasksPage from "./pages/tasks/TasksPage";
import SettingsPage from "./pages/settings/SettingsPage";

import type { ThemeMode } from "./theme";

const THEME_STORAGE_KEY = "mei-crm-theme";

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);

    document.documentElement.setAttribute("data-theme", mode);
    document.body.setAttribute("data-theme", mode);

    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}