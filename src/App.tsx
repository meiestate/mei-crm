import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import { ThemeMode } from "./theme";

export default function App() {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/leads" replace />} />

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
          path="/dashboard"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/contacts"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/deals"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/tasks"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <LeadsPage
              mode={mode}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route path="*" element={<Navigate to="/leads" replace />} />
      </Routes>
    </BrowserRouter>
  );
}