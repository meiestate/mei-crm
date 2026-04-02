import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import TasksPage from "./pages/tasks/TasksPage";
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
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />

        <Route
          path="/leads"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/leads/:id"
          element={<LeadDetailPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/tasks"
          element={<TasksPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/dashboard"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/contacts"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/deals"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route
          path="/settings"
          element={<LeadsPage mode={mode} onToggleTheme={toggleTheme} />}
        />

        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </BrowserRouter>
  );
}